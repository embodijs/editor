import type { MaybePromise } from '$/lib/helpers/types';
import type { GitFile } from '$core/model/content';
import type { Project } from '$core/model/project';
import type { GitRepo, GitRepoMeta, GitRepoMetaMinimal } from '$core/model/repo';

export const createGitRepo = (params: { owner: string; repo: string }): GitRepo => ({
	owner: params.owner,
	name: params.repo
});

export const projectToRepo = (project: Project): GitRepo => ({
	owner: project.owner,
	name: project.name
});

export const extractJsonFromGitFile = (data: GitFile) => {
	const text = Buffer.from(data.content, data.encoding).toString('utf8');
	return JSON.parse(text);
};

export const markExistingRepos = async (
	repoPromise: MaybePromise<GitRepoMetaMinimal[]>,
	projectPromise: MaybePromise<Project[]>
): Promise<(GitRepoMetaMinimal & { projectId?: Project['id'] })[]> => {
	const [repos, projects] = await Promise.all([repoPromise, projectPromise]);
	return repos.map((repo) => {
		const mappedProject = projects.find(
			(project) => project.owner === repo.owner && project.name === repo.name
		);
		if (mappedProject) {
			return { projectId: mappedProject.id, ...repo };
		} else {
			return { ...repo };
		}
	});
};
