import { getInternalGitUser, type UserLocals } from '$core/logic/user';
import type { GitRepo, NewGitBlob, NewGitCommit, NewGitTree } from '$core/model/repo';
import * as core from '$core/logic/file';
import * as service from '$services/content';
import type { Article, DataRecord } from '$core/model/file';
import type { Collection } from '$core/model/collection';

export const getRecord = (
	path: string,
	collection: Collection,
	repo: GitRepo,
	locals: UserLocals
) => {
	const user = getInternalGitUser(locals);
	return core.getRecord(path, collection, (path: string) =>
		service.getRawContent(path, repo, user)
	);
};

export const getArticle = (path: string, repo: GitRepo, locals: UserLocals) => {
	const user = getInternalGitUser(locals);
	return core.getArticle(path, (path: string) => service.getRawContent(path, repo, user));
};

export const saveRecord = (
	record: DataRecord,
	path: string,
	repo: Required<GitRepo>,
	locals: UserLocals
) => {
	const user = getInternalGitUser(locals);
	return core.saveRecord(record, path, {
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
