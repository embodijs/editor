import { isAuthorized } from '$/lib/server/auth';
import { getProjects } from '$services/project';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const { user } = locals;

	const projects = await getProjects(user.id);

	return {
		projects
	};
};
