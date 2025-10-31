import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInternalGitUser } from '$core/logic/user';
import { isAuthorized } from '$/lib/server/guards';
import { getCollectionContent } from '$layer/collection';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
	isAuthorized(locals);
	const user = getInternalGitUser(locals);

	const { collections, currentProject } = await parent();
	const gitRepo = { owner: currentProject.owner, name: currentProject.name };

	const currentCollection = collections.find((c) => c.name === params.collection);

	if (!currentCollection) {
		throw error(404, {
			type: 'Collection not found',
			message: 'The collection you try to open, does not exist in this project'
		});
	}
	const { loader } = currentCollection;
	if (loader.type === 'file') {
		redirect(
			302,
			resolve('/(app)/project/[projectId]/collection/[collection]/open/[...path]', {
				projectId: currentProject.id,
				collection: currentCollection.name,
				path: loader.path
			})
		);
	}
	const articlesMeta = await getCollectionContent(loader, gitRepo, user);

	return {
		articlesMeta,
		collectionName: params.collection
	};
};
