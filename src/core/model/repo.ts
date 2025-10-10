import * as v from 'valibot';
import { Collection } from './collection';

export const GitRepoMeta = v.object({
	name: v.string(),
	owner: v.string(),
	fullName: v.string(),
	private: v.boolean(),
	hasPages: v.boolean(),
	id: v.string(),
	url: v.string(),
	description: v.optional(v.string())
});

export const GitRepoMetaMinimal = v.pick(GitRepoMeta, [
	'name',
	'owner',
	'description',
	'fullName',
	'private',
	'id'
]);

export const GitRepo = v.object({
	owner: v.string(),
	name: v.string(),
	branch: v.optional(v.string())
});

export const GitRepoConfig = v.object({
	collections: v.array(Collection),
	updatedAt: v.optional(v.number())
});

export const NewGitBlob = v.object({
	content: v.string(),
	encoding: v.picklist(['base64', 'utf-8'])
});

export const GitBlob = v.object({
	content: v.string(),
	encoding: v.string(),
	url: v.string(),
	sha: v.string()
});

export const GitBlobRef = v.object({
	url: v.string(),
	sha: v.string()
});

export const GitCommitRef = v.object({
	url: v.string(),
	sha: v.string()
});

export const NewGitCommit = v.object({
	message: v.string(),
	parents: v.array(v.string()),
	tree: v.string()
});

export enum GitTreeType {
	BLOB = 'blob',
	TREE = 'tree',
	COMMIT = 'commit'
}

const GitTreeMode = v.optional(
	v.picklist(['100644', '100755', '040000', '160000', '120000']),
	'100644'
);

export const NewGitTree = v.union([
	v.object({
		path: v.string(),
		mode: GitTreeMode,
		type: v.enum(GitTreeType),
		sha: v.string()
	}),
	v.object({
		path: v.string(),
		mode: GitTreeMode,
		type: v.enum(GitTreeType),
		content: v.string()
	})
]);

export const GitTree = v.object({
	path: v.string(),
	mode: GitTreeMode,
	type: v.enum(GitTreeType),
	size: v.optional(v.number()),
	sha: v.string(),
	url: v.optional(v.string())
});

export const GitTreeResponse = v.object({
	tree: v.array(GitTree),
	sha: v.string(),
	url: v.string(),
	truncated: v.boolean()
});

export const GitRefResult = v.object({
	ref: v.string(),
	url: v.string(),
	object: v.object({
		type: v.string(),
		sha: v.string(),
		url: v.string()
	})
});

export type GitRepoMeta = v.InferOutput<typeof GitRepoMeta>;
export type GitRepoMetaMinimal = v.InferOutput<typeof GitRepoMetaMinimal>;
export type GitRepo = v.InferOutput<typeof GitRepo>;
export type NewGitBlob = v.InferOutput<typeof NewGitBlob>;
export type GitBlob = v.InferOutput<typeof GitBlob>;
export type GitBlobRef = v.InferOutput<typeof GitBlobRef>;
export type GitRepoConfig = v.InferOutput<typeof GitRepoConfig>;
export type GitTree = v.InferOutput<typeof GitTree>;
export type NewGitCommit = v.InferOutput<typeof NewGitCommit>;
export type GitCommitRef = v.InferOutput<typeof GitCommitRef>;
export type NewGitTree = v.InferOutput<typeof NewGitTree>;
export type GitTreeResponse = v.InferOutput<typeof GitTreeResponse>;
export type GitRefResult = v.InferOutput<typeof GitRefResult>;
