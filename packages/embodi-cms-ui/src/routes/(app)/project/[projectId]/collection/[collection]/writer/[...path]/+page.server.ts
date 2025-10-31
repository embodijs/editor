import { isAuthorized } from '$/lib/server/guards';
import {
	generateArticleFormSchema,
	generateArticleFileName,
	isValidFilePath
} from '$core/logic/file';
import type { Actions, RouteParams, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import { getDirPath } from '$core/logic/collection.js';
import type { Collection, Loader } from '$core/model/collection';
import { getProjectConfig } from '$layer/project';
import { projectToRepo } from '$core/logic/project';
import { saveArticle, getArticle } from '$layer/file';
import { dirname } from 'path';
import { getDb } from '$/lib/db/index.server.js';
import * as path from 'node:path';
import { getProject } from '$services/project';
import type { GitRepo } from '$core/model/repo';

const getCurrentCollection = (collections: Collection[], name: string) =>
	collections.find((collection) => collection.name === name);

const getFilePath = (params: RouteParams, loader: Loader, article: Articel) => {
	if (params.path) {
		return params.path;
	} else if (loader.type === 'file') {
		return loader.path;
	} else {
		const fileName = generateArticleFileName(article);
		return path.join(loader.base ?? '', fileName);
	}
};

export const load: PageServerLoad = async ({ params, locals, platform }) => {
	isAuthorized(locals);
	const { path } = params;
	const dbConnection = getDb(platform?.env);

	const currentProject = await getProject(dbConnection, params.projectId);
	if (!currentProject) {
		throw error(404, {
			type: 'Project not found',
			message: 'The Project your try to open seems to be not exist'
		});
	}
	const repo: GitRepo = projectToRepo(currentProject);
	const { collections } = (await getProjectConfig(repo, locals)) ?? {};
	const collection = getCurrentCollection(collections, params.collection);
	if (!collection) {
		throw error(404, {
			type: 'Collection not found',
			message: 'The Collection your try to open seems to be not exist'
		});
	}
	const { fields, loader } = collection;
	if (path?.length !== 0) {
		if (isValidFilePath(loader, path)) {
			throw error(406, {
				type: 'File type not supported',
				message: 'File type is not supported for this collection'
			});
		}
		const article = await getArticle(path, repo, locals);
		const metaForm = await superValidate(article, valibot(generateArticleFormSchema(fields)));
		return {
			metaForm,
			formFields: fields,
			path: dirname(path),
			collection,
			currentProject
		};
	} else {
		const metaForm = await superValidate(valibot(generateArticleFormSchema(fields)));
		return {
			metaForm,
			formFields: fields,
			path: getDirPath(loader),
			collection,
			currentProject
		};
	}
};

export const actions: Actions = {
	default: async ({ request, params, locals, platform }) => {
		isAuthorized(locals);
		const dbConnection = getDb(platform?.env);
		const project = await getProject(dbConnection, params.projectId);
		if (!project) {
			throw error(404, {
				type: 'Project not found',
				message: 'The project you try to open does not exist'
			});
		}
		const repo = projectToRepo(project);
		const { collections } = await getProjectConfig(repo, locals);
		const { fields, loader } = getCurrentCollection(collections, params.collection) ?? {};

		if (!fields || !loader) {
			throw error(404, {
				type: 'Collection not found',
				message: 'The collection you try to open does not exist'
			});
		}

		const form = await superValidate(
			await request.formData(),
			valibot(generateArticleFormSchema(fields))
		);
		if (!form.valid) {
			return fail(400, { form });
		}
		const { meta, markdown, files } = form.data;
		const path = getFilePath(params, loader, form.data);
		await saveArticle(
			{
				meta,
				markdown,
				files
			},
			path,
			{
				...repo,
				branch: 'main'
			},
			locals
		);
		return { form };
	}
};
