import type { GitOrg } from '$core/model/org';
import type { BaseGitRepo, GitRepo } from '$core/model/repo';
import type { InternalGitUser } from '$core/model/user';
import { generateGithubBase, getGithubClient } from '$lib/server/git';

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
		fullName: repo.full_name,
		private: repo.private,
		sufficientAccessRights: repo.permissions?.admin == true || repo.permissions?.push == true,
		id: repo.id.toString(),
		url: repo.html_url,
		description: repo.description ?? undefined
	}));
};

export const readRepoContentFromGithub = async (
	path: string,
	repo: BaseGitRepo,
	user: InternalGitUser
) => {
	const github = getGithubClient();
	const data = await github.rest.repos.getContent({
		path,
		owner: repo.owner,
		repo: repo.name,
		...generateGithubBase(user)
	});

	return data;
};
