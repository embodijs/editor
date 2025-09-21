import type { Collection } from '$core/model/config';
import type { GitFileMeta } from '$core/model/content';
import { GitRepoConfig } from '$core/model/repo';
import type { GetGitContent, GetGitFileContent } from '$core/types/external';
import * as v from 'valibot';

export const getCollectionTree = async (
	collection: Collection,
	load: GetGitContent
): Promise<GitFileMeta[]> => {
	const { path } = collection;
	const tree = await load(path.base);
	if (!Array.isArray(tree)) {
		throw new Error('Invalid tree');
	}
	// TODO: Filter by pattern
	console.log(tree, path.base.slice(1));

	return tree.filter((el) => el.type === 'file') as unknown as GitFileMeta[];
};

export const getProjectConfigFile = async (load: GetGitFileContent): Promise<GitRepoConfig> => {
	const jsonString = await load('.embodi/cms/config.json');
	if (!jsonString) {
		throw new Error('Config file not found');
	}
	try {
		const config = JSON.parse(jsonString as string);
		return v.parse(GitRepoConfig, config);
	} catch (error) {
		console.error(error);
		throw new Error('Invalid JSON');
	}
};
