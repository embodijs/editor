import type { GitContent, GitDirContent, GitFile } from '$core/model/content';
import type { GitOrg } from '$core/model/org';
import type { BaseGitRepo, GitRepo } from '$core/model/repo';
import type { InternalGitUser } from '$core/model/user';
import { generateGithubBase, getGithubClient, type GithubRest } from '$lib/server/git';
import type { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';

export const getRepoFromGithubByOrg = async (
	org: GitOrg,
	user: InternalGitUser
): Promise<GitRepo[]> => {
	const github = getGithubClient();
	const { data } = await github.rest.repos.listForOrg({
		org: org.name,
		...generateGithubBase(user)
	});

	return data.map((repo) => ({
		name: repo.name,
		owner: org.name,
		fullName: repo.full_name,
		private: repo.private,
		sufficientAccessRights: repo.permissions?.admin == true || repo.permissions?.push == true,
		id: repo.id.toString(),
		url: repo.html_url,
		description: repo.description ?? undefined
	}));
};

export const getRepoFromGithubByUser = async (user: InternalGitUser): Promise<GitRepo[]> => {
	const github = getGithubClient();
	const { data } = await github.rest.repos.listForAuthenticatedUser(generateGithubBase(user));

	return data.map((repo) => ({
		name: repo.name,
		owner: user.username,
		fullName: repo.full_name,
		private: repo.private,
		sufficientAccessRights: repo.permissions?.admin == true || repo.permissions?.push == true,
		id: repo.id.toString(),
		url: repo.html_url,
		description: repo.description ?? undefined
	}));
};

type GithubFileType<
	T extends GetResponseDataTypeFromEndpointMethod<
		GithubRest['repos']['getContent']
	> = GetResponseDataTypeFromEndpointMethod<GithubRest['repos']['getContent']>
> = T extends { type: 'file' } ? T : never;

type GithubContentArray<
	T extends GetResponseDataTypeFromEndpointMethod<
		GithubRest['repos']['getContent']
	> = GetResponseDataTypeFromEndpointMethod<GithubRest['repos']['getContent']>
> = T extends (infer A)[] ? A : never;
//TODO: check encoding and pissble formats
const convertGithubContentToGitFile = (repo: GithubFileType): GitFile => ({
	type: repo.type,
	encoding: repo.encoding as 'base64',
	path: repo.path,
	name: repo.name,
	size: repo.size,
	content: repo.content
});

const convertGithubContentToGitContent = (repo: GithubContentArray): GitDirContent => ({
	type: repo.type,
	path: repo.path,
	name: repo.name,
	size: repo.size
});

export const getRepoContentFromGithub = async (
	path: string,
	repo: BaseGitRepo,
	user: InternalGitUser
): Promise<GitContent> => {
	const github = getGithubClient();
	const response = await github.rest.repos.getContent({
		path,
		owner: repo.owner,
		repo: repo.name,
		...generateGithubBase(user)
	});
	const { data, status } = response;
	console.log({ data, status });
	if (status !== 200) {
		throw new Error('Not found');
	}
	if (Array.isArray(data)) {
		return data
			.filter((item) => item.type === 'file' || item.type === 'dir')
			.map(convertGithubContentToGitContent);
	} else if (data.type === 'file') {
		return convertGithubContentToGitFile(data);
	}
	throw new Error('Invalid content type');
};
