import type { GitFile } from '$core/model/content';
import type { BaseGitRepo } from '$core/model/repo';

export const createBaseGitRepo = (params: { owner: string; repo: string }): BaseGitRepo => ({
	owner: params.owner,
	name: params.repo
});

export const extractJsonFromGitFile = (data: GitFile) => {
	const text = Buffer.from(data.content, data.encoding).toString('utf8');
	return JSON.parse(text);
};
