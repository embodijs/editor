import * as v from 'valibot';

export const GitFileSchema = v.object({
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

export const GitFileMetaSchema = v.object({
	type: v.literal('file'),
	...GitDirContentBase.entries
});

export const GitDirContentSchema = v.union([
	v.object({
		type: v.literal('dir'),
		...GitDirContentBase.entries
	}),
	GitFileMetaSchema,
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

export const GitContentSchema = v.union([GitFileSchema, v.array(GitDirContentSchema)]);

export type GitContent = v.InferOutput<typeof GitContentSchema>;

export type GitDirContent = v.InferOutput<typeof GitDirContentSchema>;
export type GitFile = v.InferOutput<typeof GitFileSchema>;
export type GitFileMeta = v.InferOutput<typeof GitFileMetaSchema>;
