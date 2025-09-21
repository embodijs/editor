import type { LayoutServerLoad } from './$types';
import { getProjects } from '$services/project';
import { isAuthorized } from '$/lib/server/guards';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);
	const { user } = locals;
	const { projectId } = params;
	const projects = await getProjects(user.id);
	return {
		user,
		projects,
		currentProjectId: projectId
	};
};
