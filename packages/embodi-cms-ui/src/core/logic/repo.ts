import type { GitFile } from '$core/model/content';
import type { Project } from '$core/model/project';
import type { GitRepo, GitRepoMetaMinimal, GitRepoOverview } from '$core/model/repo';

export const createGitRepo = (params: { owner: string; repo: string }): GitRepo => ({
	owner: params.owner,
	name: params.repo
});

export const extractJsonFromGitFile = (data: GitFile) => {
	const text = Buffer.from(data.content, data.encoding).toString('utf8');
	return JSON.parse(text);
};

export const markExistingRepos = (
	repos: GitRepoMetaMinimal[],
	projects: Project[]
): (GitRepoMetaMinimal & { projectId?: Project['id'] })[] => {
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

export const getRepoOverview = async (services: {
	getRepos: () => Promise<GitRepoOverview[]>;
	getProjects: () => Promise<Project[]>;
}) => {
	const [repos, projects] = await Promise.all([services.getRepos(), services.getProjects()]);
	return repos.map((repo) => ({
		...repo,
		repos: markExistingRepos(repo.repos, projects)
	}));
};
