import * as v from 'valibot';

export const CollectionSchema = v.object({
	path: v.object({ base: v.string(), pattern: v.union([v.array(v.string()), v.string()]) }),
	name: v.string(),
	description: v.optional(v.string())
});

export const EmbodiConfigSchema = v.object({
	repo: v.string(),
	owner: v.string(),
	title: v.optional(v.string()),
	collections: v.array(CollectionSchema)
});

export const ExternalEmbodiConfigSchema = v.pick(EmbodiConfigSchema, ['title', 'collections']);
export type ExternalEmbodiConfig = v.InferOutput<typeof ExternalEmbodiConfigSchema>;
export type EmbodiConfig = v.InferOutput<typeof EmbodiConfigSchema>;
