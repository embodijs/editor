import { Collection } from './collection';
import * as v from 'valibot';

export const ProjectConfig = v.object({
	collections: v.array(Collection),
	assets: v.optional(v.array(v.string())),
	updatedAt: v.optional(v.number()),
	v: v.optional(v.literal('1.0'))
});

export type ProjectConfig = v.InferOutput<typeof ProjectConfig>;
export type GitProjectConfig = v.InferInput<typeof ProjectConfig>;
