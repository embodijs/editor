import { isAuthorized } from '$lib/server/guards';
import { getRepos } from '$services/repo';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { NewProject } from '$core/model/project';
import { getInternalGitUser } from '$core/logic/user';
import { getProjects } from '$services/project';
import { markExistingRepos } from '$core/logic/repo';

export const load: PageServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const user = getInternalGitUser(locals.user, locals.session);

	const [repos, formAdd, projects] = await Promise.all([
		getRepos(user),
		superValidate(valibot(NewProject)),
		getProjects(user.id)
	]);

	const reposByOwner = await Promise.all([
		{
			owner: {
				id: user.id,
				name: user.username
			},
			repos: markExistingRepos(repos, projects)
		}
	]);

	return { reposByOwner, formAdd };
};
