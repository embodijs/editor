import type { LayoutServerLoad } from './$types';
import { getProjects } from '$services/project';
import { isAuthorized } from '$/lib/server/guards';
import { error } from '@sveltejs/kit';
import { getFileContent } from '$services/content';
import { createInternalGitUser } from '$core/logic/user';
import { getProjectConfigFile } from '$core/logic/project';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);
	const { user } = locals;

	const { projectId } = params;
	const projects = await getProjects(user.id);

	const currentProject = projects.find((project) => project.id === projectId);
	if (!currentProject) {
		throw error(404, 'Project not found');
	}

	const projectConfig = await getProjectConfigFile((path: string) =>
		getFileContent(
			path,
			{
				owner: currentProject.owner,
				name: currentProject.repo
			},
			createInternalGitUser(locals)
		)
	);

	return {
		user,
		projects,
		currentProject,
		collections: projectConfig.collections
	};
};
