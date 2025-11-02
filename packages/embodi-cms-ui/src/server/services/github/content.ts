import type { GitDirContent } from '$core/model/content';
import {
	GitCommitRef,
	GitRefResult,
	GitTreeResponse,
	NewGitBlob,
	NewGitCommit,
	type GitBlobRef,
	type GitRepo,
	type NewGitTree
} from '$core/model/repo';
import type { InternalGitUser } from '$core/model/user';
import { RequestError } from 'octokit';
import { generateRestBase, getClient } from './github';
import * as v from 'valibot';

export const getRawContent = async (
	path: string,
	branch: GitRepo,
	user: InternalGitUser
): Promise<string | null> => {
	try {
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

		return null;
	} catch (error) {
		if (error instanceof RequestError) {
			if (error.status === 404) {
				return null;
			}
		}
		throw error;
	}
};

export const getFileContent = async (
	path: string,
	branch: GitRepo,
	user: InternalGitUser
): Promise<Buffer | null> => {
	try {
		const client = getClient();
		const response = await client.request('GET /repos/{owner}/{repo}/contents/{path}', {
			owner: branch.owner,
			repo: branch.name,
			path,
			ref: branch.branch,
			...generateRestBase(user)
		});

		const { status, data } = response;
		if (status === 200 && !Array.isArray(data) && data.type === 'file') {
			if (data.download_url) {
				const response = await fetch(data.download_url);
				const buffer = await response.arrayBuffer();
				return Buffer.from(buffer);
			} else {
				return Buffer.from(data.content, 'base64');
			}
		}

		return null;
	} catch (error) {
		if (error instanceof RequestError) {
			if (error.status === 404) {
				return null;
			}
		}
		throw error;
	}
};

export const getDirContent = async (
	path: string,
	branch: GitRepo,
	user: InternalGitUser
): Promise<GitDirContent[]> => {
	const client = getClient();
	const response = await client.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: branch.owner,
		repo: branch.name,
		path,
		ref: branch.branch,
		...generateRestBase(user, { Accept: 'application/vnd.github.v3+json' })
	});

	const { status, data } = response;

	if (status !== 200 || !Array.isArray(data)) {
		throw new Error('Directory not found on Github');
	}

	return data.map((item) => ({
		name: item.name,
		path: item.path,
		type: item.type,
		size: item.size,
		url: item.download_url
	}));
};

export const storeBlob = async (
	blob: NewGitBlob,
	repo: GitRepo,
	user: InternalGitUser
): Promise<GitBlobRef> => {
	const client = getClient();
	const result = await client.request('POST /repos/{owner}/{repo}/git/blobs', {
		owner: repo.owner,
		repo: repo.name,
		content: blob.content,
		encoding: blob.encoding,
		...generateRestBase(user)
	});

	return result.data;
};

export const storeTree = async (
	tree: NewGitTree[],
	base: string | undefined,
	repo: GitRepo,
	user: InternalGitUser
): Promise<GitTreeResponse> => {
	const client = getClient();
	const result = await client.request('POST /repos/{owner}/{repo}/git/trees', {
		owner: repo.owner,
		repo: repo.name,
		tree,
		base_tree: base,
		...generateRestBase(user)
	});

	return v.parse(GitTreeResponse, result.data);
};

export const commit = async (
	{ message, parents, tree }: NewGitCommit,
	repo: GitRepo,
	user: InternalGitUser
): Promise<GitCommitRef> => {
	const client = getClient();
	const result = await client.request('POST /repos/{owner}/{repo}/git/commits', {
		owner: repo.owner,
		repo: repo.name,
		message,
		parents,
		tree,
		...generateRestBase(user)
	});

	return result.data;
};

export const getRef = async (
	repo: Required<GitRepo>,
	user: InternalGitUser
): Promise<GitCommitRef> => {
	const client = getClient();
	const result = await client.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
		owner: repo.owner,
		repo: repo.name,
		ref: `heads/${repo.branch}`,
		...generateRestBase(user)
	});

	return result.data.object;
};

export const updateRef = async (
	commit: GitCommitRef,
	branch: Required<GitRepo>,
	user: InternalGitUser
): Promise<GitRefResult> => {
	const client = getClient();
	const result = await client.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
		owner: branch.owner,
		repo: branch.name,
		ref: `heads/${branch.branch}`,
		sha: commit.sha,
		...generateRestBase(user)
	});

	return result.data;
};

export const commitAndUpdateRef = async (
	{ message, parents, tree }: NewGitCommit,
	repo: Required<GitRepo>,
	user: InternalGitUser
): Promise<GitRefResult> => {
	const ref = await commit({ message, parents, tree }, repo, user);
	return updateRef(ref, repo, user);
};
