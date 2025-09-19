import type { GitContent, GitDirContent, GitFile } from '$core/model/content';
import type { BaseGitRepo, GitRepo } from '$core/model/repo';
import { PLATFORMS, type InternalGitUser } from '$core/model/user';
import { getReposFromGithub, getRepoMetaFromGitbub } from './github/repo';

export const getRepos = (user: InternalGitUser) => {
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
): Promise<GitRepo> => {
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

// export const getRepoContentFromGithub = async (
// 	path: string,
// 	repo: BaseGitRepo,
// 	user: InternalGitUser
// ): Promise<GitContent> => {
// 	const github = getGithubClient();
// 	const response = await github.rest.repos.getContent({
// 		path,
// 		owner: repo.owner,
// 		repo: repo.name,
// 		...generateGithubBase(user)
// 	});
// 	const { data, status } = response;
// 	console.log({ data, status });
// 	if (status !== 200) {
// 		throw new Error('Not found');
// 	}
// 	if (Array.isArray(data)) {
// 		return data
// 			.filter((item) => item.type === 'file' || item.type === 'dir')
// 			.map(convertGithubContentToGitContent);
// 	} else if (data.type === 'file') {
// 		return convertGithubContentToGitFile(data);
// 	}
// 	throw new Error('Invalid content type');
// };
