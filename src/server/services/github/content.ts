import type { GitRepo } from '$core/model/repo';
import type { InternalGitUser } from '$core/model/user';
import { generateRestBase, getClient } from './github';

export const getFileContentFromGithub = async (
	path: string,
	branch: GitRepo,
	user: InternalGitUser
): Promise<string> => {
	const client = getClient();
	const response = await client.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: branch.owner,
		repo: branch.name,
		path,
		ref: branch.branch,
		...generateRestBase(user, { Accept: 'application/vnd.github.raw+json' })
	});

	const { status, data } = response;
	if (status === 200 && typeof data === 'string') {
		return data as string;
	}

	throw new Error('File not found on Github');
};

// export const getRepoContentFromGithub = async (
// 	path: string,
// 	repo: BaseGitRepo,
// 	user: InternalGitUser
// ): Promise<GitContent> => {
// 	const github = getGithubClient();
// 	const response = await github.rest.repos.getContent({
// 		path,
// 		owner: repo.owner,
// 		repo: repo.name,
// 		...generateGithubBase(user)
// 	});
// 	const { data, status } = response;
// 	console.log({ data, status });
// 	if (status !== 200) {
// 		throw new Error('Not found');
// 	}
// 	if (Array.isArray(data)) {
// 		return data
// 			.filter((item) => item.type === 'file' || item.type === 'dir')
// 			.map(convertGithubContentToGitContent);
// 	} else if (data.type === 'file') {
// 		return convertGithubContentToGitFile(data);
// 	}
// 	throw new Error('Invalid content type');
// };
