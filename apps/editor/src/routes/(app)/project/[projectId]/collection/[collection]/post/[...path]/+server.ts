import type { RequestHandler } from './$types';
import * as service from '$services/content';
import { isAuthorized } from '$/lib/server/guards';
import { getInternalGitUser } from '$core/logic/user';
import type { GitRepo } from '$core/model/repo';
import { getProject } from '$services/project';

export const GET: RequestHandler = async ({ params, locals }) => {
	isAuthorized(locals);
	const user = getInternalGitUser(locals);
	const project = await getProject(params.projectId);
	if (!project) {
		throw new Error('Project not found');
	}
	const repo: GitRepo = {
		owner: project.owner,
		name: project.repo
	};
	const file = await service.getFileContent(params.path, repo, user);
	return new Response(file);
};
