import * as v from 'valibot';
import * as table from '$lib/db/schema';
import { createSelectSchema } from 'drizzle-valibot';

export const ProjectDatabaseSchema = createSelectSchema(table.project);
export const ProjectSchema = ProjectDatabaseSchema;

export const CreateProjectSchema = v.pick(ProjectSchema, [
	'name',
	'description',
	'repoId',
	'repo',
	'owner'
]);

export type NewProject = v.InferOutput<typeof CreateProjectSchema>;
export type Project = v.InferOutput<typeof ProjectSchema>;
export type ProjectDatabase = v.InferOutput<typeof ProjectDatabaseSchema>;
