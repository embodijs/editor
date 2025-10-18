import * as core from '$core/logic/project';
import { getInternalGitUser, type UserLocals } from '$core/logic/user';
import type { GitRepo } from '$core/model/repo';
import { getJsonContent } from '$services/content';

export const hasProjectConfig = (repo: GitRepo, locals: UserLocals) =>
	core.hasValidProjectConfig((path: string) =>
		getJsonContent(
			path,
			{
				owner: repo.owner,
				name: repo.name
			},
			getInternalGitUser(locals)
		)
	);

export const getProjectConfig = (repo: GitRepo, locals: UserLocals) =>
	core.getProjectConfig((path: string) =>
		getJsonContent(
			path,
			{
				owner: repo.owner,
				name: repo.name
			},
			getInternalGitUser(locals)
		)
	);
