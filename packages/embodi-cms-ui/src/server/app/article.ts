import { getInternalGitUser, type UserLocals } from '$core/logic/user';
import type { GitRepo, NewGitBlob, NewGitCommit, NewGitTree } from '$core/model/repo';
import * as core from '$core/logic/article';
import * as service from '$services/content';
import type { Article } from '$core/model/article';

export const saveArticle = (
	article: Article,
	path: string,
	repo: Required<GitRepo>,
	locals: UserLocals
) => {
	const user = getInternalGitUser(locals);
	return core.saveArticle(article, path, {
		getCommit: () => {
			return service.getRef(repo, user);
		},
		commit: (commit: NewGitCommit) => {
			return service.commitAndUpdateRef(commit, repo, user);
		},
		storeTree: (tree: NewGitTree[], base: string) => {
			return service.storeTree(tree, base, repo, user);
		},
		storeBlob: (blob: NewGitBlob) => {
			return service.storeBlob(blob, repo, user);
		}
	});
};
