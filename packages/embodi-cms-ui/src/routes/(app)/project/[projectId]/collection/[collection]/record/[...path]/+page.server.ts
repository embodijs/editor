import { isAuthorized } from '$/lib/server/guards';
import { generateRecordFormSchema } from '$core/logic/file';
import type { Actions, RouteParams, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Collection, Loader } from '$core/model/collection';
import { getProjectConfig } from '$layer/project';
import { projectToRepo } from '$core/logic/project';
import { getRecord, saveRecord } from '$layer/file';
import { dirname } from 'path';
import { minimatch } from 'minimatch';
import { getDb } from '$/lib/db/index.server';
import * as path from 'node:path';
import { getProject } from '$services/project';
import { getDirPath } from '$core/logic/collection';
import type { DataRecord } from '$core/model/file';

const getCurrentCollection = (collections: Collection[], name: string) =>
	collections.find((collection) => collection.name === name);

const getFilePath = (params: RouteParams, loader: Loader, record: DataRecord) => {
	if (params.path) {
		return params.path;
	} else if (loader.type === 'file') {
		return loader.path;
	} else {
		const fileName = record.name;
		return path.join(loader.base ?? '', fileName);
	}
};

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	isAuthorized(locals);
	const { path } = params;

	const { currentProject, collections } = await parent();

	const collection = getCurrentCollection(collections, params.collection);
	if (!collection) {
		throw error(404, {
			type: 'Collection not found',
			message: 'The Collection your try to open seems to be not exist'
		});
	}
	const { fields, loader } = collection;
	if (path?.length !== 0) {
		if (
			(loader.type === 'glob' && !minimatch(path, loader.pattern)) ||
			(loader.type === 'file' && path !== loader.path.replace(/^.\//, ''))
		) {
			throw error(406, {
				type: 'File type not supported',
				message: 'The file type is not supported for this collection'
			});
		}
		const record = await getRecord(path, projectToRepo(currentProject), locals);
		const recordForm = await superValidate(record, valibot(generateRecordFormSchema(fields)));
		return {
			recordForm,
			formFields: fields,
			path: dirname(path),
			collection,
			currentProject
		};
	} else {
		const recordForm = await superValidate(valibot(generateRecordFormSchema(fields)));
		return {
			recordForm,
			formFields: fields,
			path: getDirPath(collection.loader),
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
		const repo = projectToRepo(project, 'main');
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
			valibot(generateRecordFormSchema(fields))
		);
		if (!form.valid) {
			return fail(400, { form });
		}
		const path = getFilePath(params, loader, form.data);
		await saveRecord(form.data, path, repo, locals);
		return { form };
	}
};
