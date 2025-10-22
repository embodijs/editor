import { isAuthorized } from '$/lib/server/guards';
import { getProjects } from '$services/project';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$/lib/db/index.server';

export const load: PageServerLoad = async ({ locals, platform }) => {
	isAuthorized(locals);
	const { user } = locals;

	const dbConnection = getDb(platform?.env);
	const [project] = await getProjects(dbConnection, user.id);

	return redirect(302, `/project/${project.id}`);
};
