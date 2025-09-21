import * as v from 'valibot';
import { Collection } from './collection';

export const GitRepoMeta = v.object({
	name: v.string(),
	owner: v.string(),
	fullName: v.string(),
	private: v.boolean(),
	hasPages: v.boolean(),
	id: v.string(),
	url: v.string(),
	description: v.optional(v.string())
});

export const GitRepoMetaMinimal = v.pick(GitRepoMeta, [
	'name',
	'owner',
	'description',
	'fullName',
	'private',
	'id'
]);

export const GitRepo = v.object({
	owner: v.string(),
	name: v.string(),
	branch: v.optional(v.string())
});

export const GitRepoConfig = v.object({
	collections: v.array(Collection),
	updatedAt: v.optional(v.number())
});

export type GitRepoMeta = v.InferOutput<typeof GitRepoMeta>;
export type GitRepoMetaMinimal = v.InferOutput<typeof GitRepoMetaMinimal>;
export type GitRepo = v.InferOutput<typeof GitRepo>;
export type GitRepoConfig = v.InferOutput<typeof GitRepoConfig>;
