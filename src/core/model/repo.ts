import * as v from 'valibot';

export const GitRepo = v.object({
	name: v.string(),
	owner: v.string(),
	fullName: v.string(),
	private: v.boolean(),
	hasPages: v.boolean(),
	id: v.string(),
	url: v.string(),
	description: v.optional(v.string())
});

export const MinimalGitRepo = v.pick(GitRepo, [
	'name',
	'owner',
	'description',
	'fullName',
	'private',
	'id'
]);

export const BaseGitRepo = v.object({
	owner: v.string(),
	name: v.string()
});
export type GitRepo = v.InferOutput<typeof GitRepo>;
export type MinimalGitRepo = v.InferOutput<typeof MinimalGitRepo>;
export type BaseGitRepo = v.InferOutput<typeof BaseGitRepo>;
