import type { GitOrg } from '$core/model/org';
import type { InternalGitUser } from '$core/model/user';
import { generateGithubBase, getGithubClient } from '$lib/server/git';

export const getGithubOrgs = async (user: InternalGitUser): Promise<GitOrg[]> => {
	const github = getGithubClient();
	const { data } = await github.rest.orgs.list(generateGithubBase(user));
	return data.map((org) => ({
		name: org.login,
		avatar: org.avatar_url,
		id: org.id.toString(),
		url: org.url,
		description: org.description ?? undefined
	}));
};
