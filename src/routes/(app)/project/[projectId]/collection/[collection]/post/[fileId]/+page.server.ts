import { isAuthorized } from '$/lib/server/guards';
import { fileIdToPath } from '$core/logic/article';
import { getArticle } from '$core/logic/content';
import { createInternalGitUser } from '$core/logic/user';
import { getFileContent } from '$services/content';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import { convertMetaFiledsToValibotSchmea } from '$core/logic/collection';
import { flatMeta } from '$core/logic/article';
import { valibot } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	isAuthorized(locals);
	const path = fileIdToPath(params.fileId);
	const user = createInternalGitUser(locals);
	const { currentProject, collections } = await parent();
	const { fields } = collections.find((collection) => collection.name === params.collection) ?? {};
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
	console.log(flatMeta(meta));
	const schema = convertMetaFiledsToValibotSchmea(fields);
	const metaForm = await superValidate(flatMeta(meta), valibot(schema));
	return {
		metaForm,
		formFields: fields,
		article: {
			meta,
			content
		}
	};
};
