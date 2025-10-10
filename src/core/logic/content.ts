import type { Collection } from '$core/model/config';
import type { GitFileMeta } from '$core/model/content';
import type { GetGitContent } from '$core/types/external';

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
