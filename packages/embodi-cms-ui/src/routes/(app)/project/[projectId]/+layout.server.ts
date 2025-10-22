import type { LayoutServerLoad } from './$types';
import { getProjects } from '$services/project';
import { isAuthorized } from '$/lib/server/guards';
import { error } from '@sveltejs/kit';
import { getInternalGitUser } from '$core/logic/user.js';

import { getProjectConfig } from '$layer/project';
import { projectToRepo } from '$core/logic/repo';
import { GitFileNotFoundException } from '$core/error/repo';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);
	try {
		const user = getInternalGitUser(locals);
		const { projectId } = params;
		const projects = await getProjects(user.id);

		const currentProject = projects.find((project) => project.id === projectId);
		if (!currentProject) {
			throw error(404, {
				type: 'Project not found',
				message: 'Sorry, but the project you are looking for does not exist.'
			});
		}

		const repo = projectToRepo(currentProject);
		const projectConfig = await getProjectConfig(repo, locals);

		await getProjectConfig(repo, locals);

		return {
			projects,
			currentProject,
			collections: projectConfig.collections
		};
	} catch (err) {
		if (err instanceof GitFileNotFoundException) {
			error(422, {
				type: 'Project config invalid',
				message: 'Your repo project config seems do be not valid anymore'
			});
		}
		throw err;
	}
};
