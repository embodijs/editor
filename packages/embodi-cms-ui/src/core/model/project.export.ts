import { Collection } from './collection';
import * as v from 'valibot';

export const ProjectConfig = v.object({
	collections: v.array(Collection),
	updatedAt: v.optional(v.number())
});

export type ProjectConfig = v.InferOutput<typeof ProjectConfig>;
export type GitProjectConfig = v.InferInput<typeof ProjectConfig>;
