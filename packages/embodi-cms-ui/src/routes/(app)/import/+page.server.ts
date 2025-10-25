import { isAuthorized } from '$lib/server/guards';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { NewProject } from '$core/model/project';
import { getInternalGitUser } from '$core/logic/user';
import { getRepoOverview } from '$layer/repo.js';
import { getDb } from '$/lib/db/index.server';

export const load: PageServerLoad = async ({ locals, platform }) => {
	isAuthorized(locals);

	const user = getInternalGitUser(locals.user, locals.session);

	const dbConnection = getDb(platform?.env);
	const formAddPromise = superValidate(valibot(NewProject));

	return {
		reposByOwner: getRepoOverview(dbConnection, user),
		formAdd: await formAddPromise
	};
};
