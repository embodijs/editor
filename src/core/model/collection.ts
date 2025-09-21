import * as v from 'valibot';

export const Collection = v.object({
	name: v.string(),
	displayName: v.string(),
	loader: v.object({
		type: v.literal('glob'),
		pattern: v.string(),
		base: v.string()
	}),
	formats: v.array(v.string()),
	schema: v.record(v.string(), v.any())
});

export type Collection = v.InferOutput<typeof Collection>;
