import type { RequestHandler } from './$types';
import * as service from '$services/content';
import { isAuthorized } from '$/lib/server/guards';
import { getInternalGitUser } from '$core/logic/user';
import type { GitRepo } from '$core/model/repo';

export const GET: RequestHandler = async ({ params, locals }) => {
	isAuthorized(locals);
	const user = getInternalGitUser(locals);
	const repo: GitRepo = {
		owner: params.owner,
		name: params.repo
	};
	const file = await service.getFileContent(params.path, repo, user);
	return new Response(file);
};
