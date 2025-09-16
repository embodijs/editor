import type { InternalGitUser } from '$core/model/user';
import { graphql } from '$lib/gql';
import { createGithubClient } from './github';

const GET_USER = graphql(`
	query GetUser {
		viewer {
			name
			id
			email
			avatarUrl
			login
		}
	}
`);

export const getCurrentUser = async (user: Pick<InternalGitUser, 'token'>) => {
	const github = createGithubClient(user.token);
	const response = await github.request(GET_USER, {});
	console.log({ response });
	return response.viewer;
};
