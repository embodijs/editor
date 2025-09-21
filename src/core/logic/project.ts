import type { Provider } from '$/lib/db/schema';
import type { NewProject, Project } from '$core/model/project';
import { GitRepoConfig } from '$core/model/repo';
import type { GetGitFileContent } from '$core/types/external';
import * as v from 'valibot';

const generateId = (): string => {
	return `p_${crypto.randomUUID()}`;
};

export const generateProject = (data: NewProject, provider: Provider): Project => {
	const now = new Date();
	return {
		...data,
		id: generateId(),
		name: data.repo,
		description: null,
		provider,
		createdAt: now,
		updatedAt: now
	};
};

export const getProjectConfigFile = async (load: GetGitFileContent): Promise<GitRepoConfig> => {
	const jsonString = await load('.embodi/cms/config.json');
	console.log({ jsonString });
	if (!jsonString) {
		throw new Error('Config file not found');
	}
	console.log({ jsonString });
	try {
		const config = JSON.parse(jsonString);
		console.log({ config });
		return v.parse(GitRepoConfig, config);
	} catch (error) {
		console.error(error);
		throw new Error('Invalid JSON');
	}
};
