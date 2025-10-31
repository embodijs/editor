import * as v from 'valibot';

export const FileUpload = v.object({
	type: v.string(),
	relativePath: v.string(),
	absolutePath: v.string(),
	base64: v.string()
});

export const RawUpload = v.object({
	path: v.string(),
	content: v.string()
});

export const ArticleSchema = v.object({
	meta: v.record(v.string(), v.unknown()),
	markdown: v.string(),
	files: v.array(FileUpload)
});

export const NewDataRecord = v.object({
	name: v.optional(v.string()),
	data: v.record(v.string(), v.unknown()),
	files: v.array(FileUpload)
});

export const DataRecord = v.object({
	name: v.string(),
	data: v.record(v.string(), v.unknown()),
	files: v.array(FileUpload)
});

export const Article = ArticleSchema;

export type DataRecord = v.InferOutput<typeof DataRecord>;
export type Article = v.InferOutput<typeof Article>;
export type FileUpload = v.InferOutput<typeof FileUpload>;
export type RawUpload = v.InferOutput<typeof RawUpload>;
