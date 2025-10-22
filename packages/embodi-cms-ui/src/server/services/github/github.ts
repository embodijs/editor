import { GraphQLClient } from 'graphql-request';
import type { InternalGitUser } from '$core/model/user';
import { Octokit } from 'octokit';

const githubOctokit = new Octokit();
//export type GithubRest = (typeof githubOctokit)['rest'];

export const getClient = () => {
	return githubOctokit;
};

export const generateRestHeaders = (user: InternalGitUser) => {
	return {
		Accept: 'application/vnd.github.v3+json',
		Authorization: `Bearer ${user.token}`,
		'X-GitHub-Api-Version': '2022-11-28'
	};
};

export const generateRestBase = (user: InternalGitUser, headers = {}) => {
	return {
		headers: {
			...generateRestHeaders(user),
			...headers
		}
	};
};

export const createGraphqlClient = (token: string) => {
	return new GraphQLClient('https://api.github.com/graphql', {
		fetch,
		headers: {
			'User-Agent': 'Embodi CMS',
			authorization: `bearer ${token}`
		}
	});
};
