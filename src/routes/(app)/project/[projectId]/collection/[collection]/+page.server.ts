import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDirContent } from '$services/content';
import { createInternalGitUser } from '$core/logic/user';
import { isAuthorized } from '$/lib/server/guards';
import { pathToArticleId } from '$core/logic/article';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
	isAuthorized(locals);
	const user = createInternalGitUser(locals);

	const { collections, currentProject } = await parent();
	const gitRepo = { owner: currentProject.owner, name: currentProject.name };

	const currentCollection = collections.find((c) => c.name === params.collection);

	if (!currentCollection) {
		throw error(404, 'Collection not found');
	}
	const articlesMeta = await getDirContent(
		currentCollection.loader.base.replace('./', ''),
		gitRepo,
		user
	);

	return {
		articlesMeta: articlesMeta.map((article) => ({
			...article,
			id: pathToArticleId(article.path)
		})),
		collectionName: params.collection
	};
};
