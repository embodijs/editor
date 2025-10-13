import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInternalGitUser } from '$core/logic/user';
import { isAuthorized } from '$/lib/server/guards';
import { getCollectionContent } from '$layer/collection';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
	isAuthorized(locals);
	const user = getInternalGitUser(locals);

	const { collections, currentProject } = await parent();
	const gitRepo = { owner: currentProject.owner, name: currentProject.name };

	const currentCollection = collections.find((c) => c.name === params.collection);

	if (!currentCollection) {
		throw error(404, 'Collection not found');
	}
	const articlesMeta = await getCollectionContent(currentCollection.loader, gitRepo, user);

	return {
		articlesMeta,
		collectionName: params.collection
	};
};
