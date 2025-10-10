import { getProjectConfigFile } from '$core/logic/project';
import { getInternalGitUser, type UserLocals } from '$core/logic/user';
import type { GitRepo } from '$core/model/repo';
import { getFileContent } from '$services/content';

export const getProjectConfig = (repo: GitRepo, locals: UserLocals) =>
	getProjectConfigFile((path: string) =>
		getFileContent(
			path,
			{
				owner: repo.owner,
				name: repo.name
			},
			getInternalGitUser(locals)
		)
	);
