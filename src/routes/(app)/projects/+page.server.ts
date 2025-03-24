import { createInternalGitUser } from '$core/model/user';
import { isAuthorized } from '$lib/server/auth';
import { getGithubOrgs } from '$services/org';
import { getRepoFromGithubByOrg, getRepoFromGithubByUser } from '$services/repo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	isAuthorized(locals);
	const gitUser = createInternalGitUser(locals.user, locals.session);
	const orgs = await getGithubOrgs(gitUser);

	const reposByOrg = await Promise.all([
		getRepoFromGithubByUser(gitUser),
		...orgs.map(async (org) => {
			const repos = await getRepoFromGithubByOrg(org, gitUser);
			return { org, repos };
		})
	]);

	return { reposByOrg };
};
