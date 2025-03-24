import type { GitOrg } from '$core/model/org';
import type { GitRepo } from '$core/model/repo';
import type { InternalGitUser } from '$core/model/user';
import type { paths as GitHubPaths } from '../../github/interface';

type GetOrgRepos =
	GitHubPaths['/orgs/{org}/repos']['get']['responses']['200']['content']['application/json'];
type GetUserRepos =
	GitHubPaths['/user/repos']['get']['responses']['200']['content']['application/json'];

export const getRepoFromGithubByOrg = async (
	org: GitOrg,
	user: InternalGitUser
): Promise<GitRepo[]> => {
	const response = await fetch(`https://api.github.com/orgs/${org.name}/repos`, {
		headers: {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `Bearer ${user.token}`,
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	const reposJson = (await response.json()) as GetOrgRepos;

	return reposJson.map((repo) => ({
		name: repo.name,
		fullName: repo.full_name,
		private: repo.private,
		sufficientAccessRights: repo.permissions?.admin == true || repo.permissions?.push == true,
		id: repo.id.toString(),
		url: repo.html_url,
		description: repo.description ?? undefined
	}));
};

export const getRepoFromGithubByUser = async (user: InternalGitUser): Promise<GitRepo[]> => {
	const response = await fetch(`https://api.github.com/user/repos`, {
		headers: {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `Bearer ${user.token}`,
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	const reposJson = (await response.json()) as GetUserRepos;

	return reposJson.map((repo) => ({
		name: repo.name,
		fullName: repo.full_name,
		private: repo.private,
		sufficientAccessRights: repo.permissions?.admin == true || repo.permissions?.push == true,
		id: repo.id.toString(),
		url: repo.html_url,
		description: repo.description ?? undefined
	}));
};
