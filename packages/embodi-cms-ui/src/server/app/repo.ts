import type { DatabaseConnection } from '$/lib/db/index.server';
import * as logic from '$core/logic/repo.js';
import type { InternalGitUser } from '$core/model/user';
import * as projectService from '$services/project.js';
import * as repoService from '$services/repo.js';

export const getRepoOverview = async (db: DatabaseConnection, user: InternalGitUser) =>
	logic.getRepoOverview({
		getRepos: () => repoService.getRepos(user),
		getProjects: () => projectService.getProjects(db, user.id)
	});
