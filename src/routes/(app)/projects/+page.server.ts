import { createInternalGitUser } from '$core/model/user';
import { isAuthorized } from '$lib/server/auth';
import { getGithubOrgs } from '$services/org';
import { getRepoFromGithubByOrg, getRepoFromGithubByUser } from '$services/repo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const gitUser = createInternalGitUser(locals.user, locals.session);
	const orgs = await getGithubOrgs(gitUser);

	const reposByOwner = await Promise.all([
		{
			owner: {
				id: gitUser.id,
				name: gitUser.username
			},
			repos: await getRepoFromGithubByUser(gitUser)
		},
		...orgs.map(async (org) => {
			const repos = await getRepoFromGithubByOrg(org, gitUser);
			return { owner: org, repos };
		})
	]);

	return { reposByOwner };
};
