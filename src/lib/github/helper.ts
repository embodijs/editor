import type { InternalGitUser } from '$core/model/user';
import { graphql } from '@octokit/graphql';


export const initGithubGraphql = async (user: InternalGitUser) => graphql.defaults({
	headers: {
		Accept: 'application/vnd.github.v3+json',
		Authorization: `Bearer ${user.token}`,
		'X-GitHub-Api-Version': '2022-11-28',
	}
});

export const fetchGithub = async (endpoint: string, user: InternalGitUser, init?: RequestInit) => {
	const response = await fetch(new URL(endpoint, 'https://api.github.com'), {
		...init,
		headers: {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `Bearer ${user.token}`,
			'X-GitHub-Api-Version': '2022-11-28',
			...init?.headers
		}
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch ${endpoint}`);
	}
	return response.json();
};
