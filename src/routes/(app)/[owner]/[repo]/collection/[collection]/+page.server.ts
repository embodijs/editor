import { getProjectConfig, isAuthorized } from '$/lib/server/guards';
import { getCollectionTree } from '$core/logic/content';
import { createBaseGitRepo } from '$core/logic/repo';
import { createInternalGitUser } from '$core/logic/user';
import { getRepoContentFromGithub } from '$services/repo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);

	const { collection } = params;
	const collectionIndex = parseInt(collection, 10);
	const gitUser = createInternalGitUser(locals);
	const gitRepo = createBaseGitRepo(params);

	const config = getProjectConfig(locals);
	const files = await getCollectionTree(config.collections[collectionIndex], (path: string) =>
		getRepoContentFromGithub(path, gitRepo, gitUser)
	);

	return {
		files
	};
};
