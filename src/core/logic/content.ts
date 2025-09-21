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
