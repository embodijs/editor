import * as v from 'valibot';

export const GitFile = v.object({
	type: v.literal('file'),
	encoding: v.picklist(['base64', 'utf8']),
	path: v.string(),
	content: v.string(),
	name: v.string(),
	size: v.number()
});

const GitDirContentBase = v.object({
	path: v.string(),
	name: v.string(),
	size: v.number()
});

export const GitFileMeta = v.object({
	type: v.literal('file'),
	...GitDirContentBase.entries
});

export const GitDirMeta = v.object({
	type: v.literal('dir'),
	...GitDirContentBase.entries
});

export const GitDirContent = v.union([
	GitDirMeta,
	GitFileMeta,
	v.object({
		type: v.literal('symlink'),
		...GitDirContentBase.entries
	}),
	v.object({
		type: v.literal('link'),
		...GitDirContentBase.entries
	}),
	v.object({
		type: v.literal('submodule'),
		...GitDirContentBase.entries
	})
]);

export const GitContent = v.union([GitFile, v.array(GitDirContent)]);

export type GitContent = v.InferOutput<typeof GitContent>;

export type GitDirContent = v.InferOutput<typeof GitDirContent>;
export type GitFile = v.InferOutput<typeof GitFile>;
export type GitFileMeta = v.InferOutput<typeof GitFileMeta>;
export type GitDirMeta = v.InferOutput<typeof GitDirMeta>;
