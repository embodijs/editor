import type { InternalGitUser } from '$core/model/user';
import { GraphQLClient } from 'graphql-request';

export const createGithubClient = (user: InternalGitUser) => {
	return new GraphQLClient('https://api.github.com/graphql', {
		headers: {
			authorization: `Bearer ${user.token}`
		}
	});
};
