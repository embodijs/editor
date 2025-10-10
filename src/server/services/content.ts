import type { GitDirContent } from '$core/model/content';
import type {
	GitBlobRef,
	GitCommitRef,
	GitRefResult,
	GitRepo,
	GitTreeResponse,
	NewGitBlob,
	NewGitCommit,
	NewGitTree
} from '$core/model/repo';
import { PLATFORMS, type InternalGitUser } from '$core/model/user';
import * as github from './github/content';

export const getFileContent = async (
	path: string,
	branch: GitRepo,
	user: InternalGitUser
): Promise<string> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return await github.getFileContent(path, branch, user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

export type GetFileContent = typeof getFileContent;

export const getDirContent = async (
	path: string,
	branch: GitRepo,
	user: InternalGitUser
): Promise<GitDirContent[]> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return await github.getDirContent(path, branch, user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

export type GetDirContent = typeof getDirContent;

export const storeBlob = async (
	blob: NewGitBlob,
	branch: GitRepo,
	user: InternalGitUser
): Promise<GitBlobRef> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return await github.storeBlob(blob, branch, user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

export type StoreBlob = typeof storeBlob;

export const storeTree = async (
	tree: NewGitTree[],
	base: string | undefined,
	branch: GitRepo,
	user: InternalGitUser
): Promise<GitTreeResponse> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return await github.storeTree(tree, base, branch, user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

export type StoreTree = typeof storeTree;

export const commit = async (
	commitData: NewGitCommit,
	branch: GitRepo,
	user: InternalGitUser
): Promise<GitCommitRef> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return await github.commit(commitData, branch, user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

export type Commit = typeof commit;

export const getRef = async (
	repo: Required<GitRepo>,
	user: InternalGitUser
): Promise<GitCommitRef> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return await github.getRef(repo, user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

export type GetRef = typeof getRef;

export const updateRef = async (
	commit: GitCommitRef,
	branch: Required<GitRepo>,
	user: InternalGitUser
): Promise<GitRefResult> => {
	switch (user.platform) {
		case PLATFORMS.GITHUB:
			return await github.updateRef(commit, branch, user);
		default:
			throw new Error(`Unsupported platform: ${user.platform}`);
	}
};

export type UpdateRef = typeof updateRef;

export const commitAndUpdateRef = async (
	commitData: NewGitCommit,
	repo: Required<GitRepo>,
	user: InternalGitUser
): Promise<GitRefResult> => {
	if (user.platform === PLATFORMS.GITHUB) {
		const ref = await github.commit(commitData, repo, user);
		return github.updateRef(ref, repo, user);
	}
	throw new Error(`Unsupported platform: ${user.platform}`);
};

export type CommitAndUpdateRef = typeof commitAndUpdateRef;
