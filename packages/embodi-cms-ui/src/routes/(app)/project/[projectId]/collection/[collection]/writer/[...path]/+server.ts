import type { RequestHandler } from './$types';
import * as service from '$services/content';
import { isAuthorized } from '$/lib/server/guards';
import { getInternalGitUser } from '$core/logic/user';
import type { GitRepo } from '$core/model/repo';
import { getProject } from '$services/project';
import { getDb } from '$/lib/db/index.server';

export const GET: RequestHandler = async ({ params, locals, platform }) => {
	isAuthorized(locals);
	const user = getInternalGitUser(locals);
	const dbConnection = getDb(platform?.env);
	const project = await getProject(dbConnection, params.projectId);
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
