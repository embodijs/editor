import { isAuthorized } from '$/lib/server/guards';
import {
	generateArticleFormSchema,
	unflatMeta,
	generateArticleFileName,
	pathToFileId
} from '$core/logic/article';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { error, redirect } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Collection } from '$core/model/collection';
import { getProjectConfig } from '$layer/project';
import { getProject } from '$services/project';
import { projectToRepo } from '$core/logic/repo';
import { saveArticle } from '$layer/article';
import { join } from 'path';

const getCurrentCollection = (collections: Collection[], name: string) =>
	collections.find((collection) => collection.name === name);

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	isAuthorized(locals);
	const { collections } = await parent();
	const { fields, loader } = getCurrentCollection(collections, params.collection) ?? {};
	if (!fields || !loader) {
		throw error(404, 'Collection not found');
	}
	const metaForm = await superValidate(valibot(generateArticleFormSchema(fields)));
	return {
		metaForm,
		formFields: fields,
		path: loader.base
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		isAuthorized(locals);
		const project = await getProject(params.projectId);
		if (!project) {
			throw error(404, 'Project not found');
		}
		const repo = projectToRepo(project);
		const { collections } = await getProjectConfig(repo, locals);
		const { fields, loader } = getCurrentCollection(collections, params.collection) ?? {};

		if (!fields || !loader) {
			throw error(404, 'Collection not found');
		}

		const form = await superValidate(
			await request.formData(),
			valibot(generateArticleFormSchema(fields))
		);
		if (!form.valid) {
			return fail(400, { form });
		}
		const { meta, markdown, files } = form.data;
		const path = loader.base;
		const fileName = generateArticleFileName(form.data);
		const filePath = join(path, fileName);
		await saveArticle(
			{
				meta: unflatMeta(meta),
				markdown,
				files
			},
			filePath,
			{
				...repo,
				branch: 'main'
			},
			locals
		);
		return redirect(
			302,
			`/app/project/${params.projectId}/collection/${params.collection}/post/${pathToFileId(filePath)}`
		);
	}
};
