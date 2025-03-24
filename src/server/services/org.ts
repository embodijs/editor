import type { GitOrg } from '$core/model/org';
import type { InternalGitUser } from '$core/model/user';
import type { paths as GitHubPaths } from '../../github/interface';

type GetOrgs = GitHubPaths['/user/orgs']['get']['responses']['200']['content']['application/json'];

export const getGithubOrgs = async (user: InternalGitUser): Promise<GitOrg[]> => {
	const orgs = await fetch(`https://api.github.com/user/orgs`, {
		headers: {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `Bearer ${user.token}`,
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	if (!orgs.ok) {
		throw new Error(`Failed to fetch orgs: ${orgs.status}`);
	}

	const orgsJson = (await orgs.json()) as GetOrgs;
	return orgsJson.map((org) => ({
		name: org.login,
		avatar: org.avatar_url,
		id: org.id.toString(),
		url: org.url,
		description: org.description ?? undefined
	}));
};
