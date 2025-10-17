import type { GitRepoMeta, GitRepoMetaMinimal } from '$core/model/repo';
import { PLATFORMS, type InternalGitUser } from '$core/model/user';
import { getReposFromGithub, getRepoMetaFromGitbub } from './github/repo';

export const getRepos = (user: InternalGitUser): Promise<GitRepoMetaMinimal[]> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return getReposFromGithub(user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

export const getRepoMeta = async (
	user: InternalGitUser,
	owner: string,
	repo: string
): Promise<GitRepoMeta> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return getRepoMetaFromGitbub(user, owner, repo);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

// type GithubFileType<
// 	T extends GetResponseDataTypeFromEndpointMethod<
// 		GithubRest['repos']['getContent']
// 	> = GetResponseDataTypeFromEndpointMethod<GithubRest['repos']['getContent']>
// > = T extends { type: 'file' } ? T : never;

// type GithubContentArray<
// 	T extends GetResponseDataTypeFromEndpointMethod<
// 		GithubRest['repos']['getContent']
// 	> = GetResponseDataTypeFromEndpointMethod<GithubRest['repos']['getContent']>
// > = T extends (infer A)[] ? A : never;
// //TODO: check encoding and pissble formats
// const convertGithubContentToGitFile = (repo: GithubFileType): GitFile => ({
// 	type: repo.type,
// 	encoding: repo.encoding as 'base64',
// 	path: repo.path,
// 	name: repo.name,
// 	size: repo.size,
// 	content: repo.content
// });

// const convertGithubContentToGitContent = (repo: GithubContentArray): GitDirContent => ({
// 	type: repo.type,
// 	path: repo.path,
// 	name: repo.name,
// 	size: repo.size
// });
