import type { InternalGitUser } from '$core/model/user';
import { Octokit } from '@octokit/rest';

const githubOctokit = new Octokit();
export type GithubRest = (typeof githubOctokit)['rest'];

export const getGithubClient = () => {
	return githubOctokit;
};

export const generateGithubHeaders = (user: InternalGitUser) => {
	return {
		Accept: 'application/vnd.github.v3+json',
		Authorization: `Bearer ${user.token}`,
		'X-GitHub-Api-Version': '2022-11-28'
	};
};

export const generateGithubBase = (user: InternalGitUser) => {
	return {
		headers: generateGithubHeaders(user)
	};
};
