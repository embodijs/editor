import type { GitRepo } from '$core/model/repo';
import { PLATFORMS, type InternalGitUser } from '$core/model/user';
import { getFileContentFromGithub } from './github/content';

export const getFileContent = async (path: string, branch: GitRepo, user: InternalGitUser) => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return await getFileContentFromGithub(path, branch, user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};
