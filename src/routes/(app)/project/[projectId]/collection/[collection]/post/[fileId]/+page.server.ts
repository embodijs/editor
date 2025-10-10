import { isAuthorized } from '$/lib/server/guards';
import {
	fileIdToPath,
	generateArticleFormSchema,
	unflatMeta,
	getArticle
} from '$core/logic/article';
import { getInternalGitUser } from '$core/logic/user';
import { getFileContent } from '$services/content';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import { flatMeta } from '$core/logic/article';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Collection } from '$core/model/collection';
import { getProjectConfig } from '$layer/project';
import { getProject } from '$services/project';
import { projectToRepo } from '$core/logic/repo';
import { updateArticle } from '$layer/article';
import { dirname } from 'path';

const getCurrentCollection = (collections: Collection[], name: string) =>
	collections.find((collection) => collection.name === name);

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	isAuthorized(locals);
	const path = fileIdToPath(params.fileId);
	const user = getInternalGitUser(locals);
	const { currentProject, collections } = await parent();
	const { fields } = getCurrentCollection(collections, params.collection) ?? {};
	if (!fields) {
		throw error(404, 'Collection not found');
	}
	const { meta, content } = await getArticle(path, (path: string) =>
		getFileContent(
			path,
			{
				owner: currentProject.owner,
				name: currentProject.repo
			},
			user
		)
	);
	console.log({ meta, content, flat: flatMeta(meta) });
	const metaForm = await superValidate(
		{ meta: flatMeta(meta), markdown: content, files: [] },
		valibot(generateArticleFormSchema(fields))
	);
	return {
		metaForm,
		formFields: fields,
		path: dirname(path),
		filePath: path
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		isAuthorized(locals);
		const project = await getProject(params.projectId);
		const path = fileIdToPath(params.fileId);
		if (!project) {
			throw error(404, 'Project not found');
		}
		const repo = projectToRepo(project);
		const { collections } = await getProjectConfig(repo, locals);
		const { fields } = getCurrentCollection(collections, params.collection) ?? {};

		if (!fields) {
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
		await updateArticle(
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
