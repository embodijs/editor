import * as v from 'valibot';

export const GitOrgSchema = v.object({
	id: v.string(),
	name: v.string(),
	description: v.optional(v.string()),
	avatar: v.optional(v.string()),
	url: v.pipe(v.string(), v.url())
});

export type GitOrg = v.InferOutput<typeof GitOrgSchema>;
