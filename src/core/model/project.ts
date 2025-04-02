import * as v from 'valibot';
import * as table from '$lib/db/schema';
import { createSelectSchema } from 'drizzle-valibot';

export const ProjectDatabaseSchema = createSelectSchema(table.project);
export const ProjectSchema = v.omit(ProjectDatabaseSchema, ['userId']);

export const CreateProjectSchema = v.object({
	...v.pick(ProjectSchema, ['repoId', 'repo', 'owner']).entries,
	name: v.optional(v.string()),
	description: v.optional(v.string())
});

export type NewProject = v.InferOutput<typeof CreateProjectSchema>;
export type Project = v.InferOutput<typeof ProjectSchema>;
export type ProjectDatabase = v.InferOutput<typeof ProjectDatabaseSchema>;
