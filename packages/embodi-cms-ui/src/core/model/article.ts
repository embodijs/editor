import * as v from 'valibot';

export const FileUpload = v.object({
	type: v.string(),
	relativePath: v.string(),
	absolutePath: v.string(),
	base64: v.string()
});
export const ArticleSchema = v.object({
	meta: v.record(v.string(), v.unknown()),
	markdown: v.string(),
	files: v.array(FileUpload)
});

export const Article = ArticleSchema;

export type Article = v.InferOutput<typeof Article>;
export type FileUpload = v.InferOutput<typeof FileUpload>;
