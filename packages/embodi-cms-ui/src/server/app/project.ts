import * as core from '$core/logic/project';
import { getInternalGitUser, type UserLocals } from '$core/logic/user';
import type { GitRepo } from '$core/model/repo';
import { getRawContent } from '$services/content';

export const hasProjectConfig = (repo: GitRepo, locals: UserLocals) =>
	core.hasValidProjectConfig((path: string) =>
		getRawContent(
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
		getRawContent(
			path,
			{
				owner: repo.owner,
				name: repo.name
			},
			getInternalGitUser(locals)
		)
	);
