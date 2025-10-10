import { getProjectConfig, isAuthorized } from '$/lib/server/guards';
import { getCollectionTree } from '$core/logic/content';
import { createGitRepo } from '$core/logic/repo';
import { getInternalGitUser } from '$core/logic/user';
import { getRepoContentFromGithub } from '$services/repo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);

	const { collection } = params;
	const collectionIndex = parseInt(collection, 10);
	const gitUser = getInternalGitUser(locals);
	const gitRepo = createGitRepo(params);

	const config = getProjectConfig(locals);
	const files = await getCollectionTree(config.collections[collectionIndex], (path: string) =>
		getRepoContentFromGithub(path, gitRepo, gitUser)
	);

	return {
		files
	};
};
