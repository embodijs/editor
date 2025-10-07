import * as v from 'valibot';

export const FileUpload = v.object({
	relativePath: v.string(),
	absolutePath: v.string(),
	blob: v.string()
});
export const ArticleFormBaseSchema = v.object({
	meta: v.record(v.string(), v.unknown()),
	markdown: v.string(),
	files: v.array(FileUpload)
});

export const ArticleFormBase = ArticleFormBaseSchema;

export type ArticleFormBase = v.InferOutput<typeof ArticleFormBase>;
export type FileUpload = v.InferOutput<typeof FileUpload>;
