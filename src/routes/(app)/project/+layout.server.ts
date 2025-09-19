import type { LayoutServerLoad } from './$types';
import { getProjects } from '$services/project';
import { isAuthorized } from '$/lib/server/guards';

export const load: LayoutServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const { user } = locals;
	const projects = await getProjects(user.id);
	return {
		user,
		projects
	};
};
