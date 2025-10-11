import * as core from '$core/logic/collection.js';
import type { Loader } from '$core/model/collection';
import type { GitRepo } from '$core/model/repo';
import type { InternalGitUser } from '$core/model/user';
import * as service from '$services/content.js';

export const getCollectionContent = async (loader: Loader, repo: GitRepo, user: InternalGitUser) =>
	core.getCollectionContent(loader, {
		getContent: async (path: string) => {
			const content = await service.getDirContent(path, repo, user);
			return content;
		}
	});
