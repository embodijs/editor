import { GraphQLClient } from 'graphql-request';

export const createGithubClient = (token: string) => {
	return new GraphQLClient('https://api.github.com/graphql', {
		headers: {
			authorization: `Bearer ${token}`
		}
	});
};
