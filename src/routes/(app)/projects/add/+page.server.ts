import { isAuthorized } from '$lib/server/auth';
import { getGithubOrgs } from '$services/org';
import { getRepoFromGithubByOrg, getRepoFromGithubByUser } from '$services/repo';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateProjectSchema } from '$core/model/project';
import { createInternalGitUser } from '$core/logic/user';

export const load: PageServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const gitUser = createInternalGitUser(locals.user, locals.session);
	const orgs = await getGithubOrgs(gitUser);

	const formAdd = await superValidate(valibot(CreateProjectSchema));

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

	return { reposByOwner, formAdd };
};

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();

		const repoId = data.get('repoId');
		// Validate input
		if (!repoId) {
			error(400, 'Missing required fields');
		}

		redirect(302, '/');
	}
} satisfies Actions;
