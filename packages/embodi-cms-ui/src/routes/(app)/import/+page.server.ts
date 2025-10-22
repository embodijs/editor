import { isAuthorized } from '$lib/server/guards';
import { getRepos } from '$services/repo';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { NewProject } from '$core/model/project';
import { getInternalGitUser } from '$core/logic/user';
import { getProjects } from '$services/project';
import { markExistingRepos } from '$core/logic/repo';
import { getDb } from '$/lib/db/index.server';

export const load: PageServerLoad = async ({ locals, platform }) => {
	isAuthorized(locals);

	const user = getInternalGitUser(locals.user, locals.session);

	const reposPromise = getRepos(user);
	const dbConnection = getDb(platform?.env);
	const projectPromise = getProjects(dbConnection, user.id);
	const formAddPromise = superValidate(valibot(NewProject));

	const reposByOwner = [
		{
			owner: {
				id: user.id,
				name: user.username
			},
			repos: markExistingRepos(reposPromise, projectPromise)
		}
	];

	return { reposByOwner, formAdd: await formAddPromise };
};
