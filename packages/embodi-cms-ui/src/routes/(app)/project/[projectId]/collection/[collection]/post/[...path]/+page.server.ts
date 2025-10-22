import { isAuthorized } from '$/lib/server/guards';
import { generateArticleFormSchema, unflatMeta, getArticle } from '$core/logic/article';
import { getInternalGitUser } from '$core/logic/user';
import { getJsonContent } from '$services/content';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Collection } from '$core/model/collection';
import { getProjectConfig } from '$layer/project';
import { getProject } from '$services/project';
import { projectToRepo } from '$core/logic/repo';
import { saveArticle } from '$layer/article';
import { dirname } from 'path';
import { minimatch } from 'minimatch';

const getCurrentCollection = (collections: Collection[], name: string) =>
	collections.find((collection) => collection.name === name);

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	isAuthorized(locals);
	const { path } = params;
	const user = getInternalGitUser(locals);
	const { currentProject, collections } = await parent();
	const collection = getCurrentCollection(collections, params.collection);
	if (!collection) {
		throw error(404, {
			type: 'Collection not found',
			message: 'The collections seems to be not exist'
		});
	}
	const { fields, loader } = collection;
	if (!minimatch(path, loader.pattern)) {
		throw error(406, {
			type: 'File type not supported',
			message: 'File type is not supported for this collection'
		});
	}
	const { meta, content } = await getArticle(path, (path: string) =>
		getJsonContent(
			path,
			{
				owner: currentProject.owner,
				name: currentProject.repo
			},
			user
		)
	);
	const metaForm = await superValidate(
		{ meta, markdown: content, files: [] },
		valibot(generateArticleFormSchema(fields))
	);
	return {
		metaForm,
		formFields: fields,
		path: dirname(path)
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		isAuthorized(locals);
		const project = await getProject(params.projectId);
		const { path } = params;
		if (!project) {
			throw error(404, {
				type: 'Project not found',
				message: 'The project you try to open does not exist'
			});
		}
		const repo = projectToRepo(project);
		const { collections } = await getProjectConfig(repo, locals);
		const { fields } = getCurrentCollection(collections, params.collection) ?? {};

		if (!fields) {
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
		await saveArticle(
			{
				meta: unflatMeta(meta),
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
