import * as v from 'valibot';

export const GitFileSchema = v.object({
	type: v.literal('file'),
	encoding: v.picklist(['base64', 'utf8']),
	path: v.string(),
	content: v.string(),
	name: v.string(),
	size: v.number()
});

export const GitDirContentSchema = v.object({
	type: v.picklist(['dir', 'file', 'symlink', 'link', 'submodule']),
	path: v.string(),
	name: v.string(),
	size: v.number()
});

export const GitContentSchema = v.union([GitFileSchema, v.array(GitDirContentSchema)]);

export type GitContent = v.InferOutput<typeof GitContentSchema>;

export type GitDirContent = v.InferOutput<typeof GitDirContentSchema>;
export type GitFile = v.InferOutput<typeof GitFileSchema>;
