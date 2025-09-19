import { PLATFORMS, type InternalGitUser } from '$core/model/user';
import { getRepoPagesFromGithub } from './github/repo';

export const getPagesConfig = (user: InternalGitUser, owner: string, name: string) => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return getRepoPagesFromGithub(user, owner, name);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};
