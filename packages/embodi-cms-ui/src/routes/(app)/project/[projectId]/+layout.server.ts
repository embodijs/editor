import type { LayoutServerLoad } from './$types';
import { getProjects } from '$services/project';
import { isAuthorized } from '$/lib/server/guards';
import { error } from '@sveltejs/kit';
import { getJsonContent } from '$services/content';
import { getInternalGitUser } from '$core/logic/user';
import { getProjectConfig } from '$core/logic/project';
import { getProjectConfig } from '$layer/project';
import { projectToRepo } from '$core/logic/repo';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);
	const { user } = locals;

	const { projectId } = params;
	const projects = await getProjects(user.id);

	const currentProject = projects.find((project) => project.id === projectId);
	if (!currentProject) {
		throw error(404, 'Project not found');
	}

	const repo = projectToRepo(currentProject);
	const projectConfig = await getProjectConfig(repo, locals);

	await getProjectConfig((path: string) =>
		getJsonContent(
			path,
			{
				owner: currentProject.owner,
				name: currentProject.repo
			},
			getInternalGitUser(locals)
		)
	);

	return {
		user,
		projects,
		currentProject,
		collections: projectConfig.collections
	};
};
