import * as v from 'valibot';

export const GitRepoSchema = v.object({
	name: v.string(),
	fullName: v.string(),
	private: v.boolean(),
	sufficientAccessRights: v.boolean(),
	id: v.string(),
	url: v.string(),
	description: v.optional(v.string())
});

export type GitRepo = v.InferOutput<typeof GitRepoSchema>;
