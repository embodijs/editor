import { isAuthorized } from '$/lib/server/guards';
import { getProjects } from '$services/project';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const { user } = locals;

	const [project] = await getProjects(user.id);

	return redirect(302, `/project/${project.id}`);
};
