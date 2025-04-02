import * as v from 'valibot';

export const CollectionSchema = v.object({
	path: v.object({ base: v.string(), pattern: v.union([v.array(v.string()), v.string()]) }),
	name: v.string(),
	description: v.optional(v.string())
});

export const EmbodiConfigSchema = v.union([
	v.object({
		version: v.optional(v.literal('0.1')),
		title: v.optional(v.string()),
		collections: v.array(CollectionSchema)
	})
]);

export type EmbodiConfig = v.InferOutput<typeof EmbodiConfigSchema>;
