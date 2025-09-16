import * as v from 'valibot';
import * as table from '$lib/db/schema';
import { createSelectSchema } from 'drizzle-valibot';

export const ProjectDatabase = createSelectSchema(table.project);
export const Project = v.omit(ProjectDatabase, ['userId']);

export const NewProject = v.object({
	...v.pick(Project, ['repoId', 'repo', 'owner', 'url']).entries,
	name: v.optional(v.string()),
	url: v.pipe(v.string(), v.url()),
	description: v.optional(v.string())
});

export type NewProject = v.InferOutput<typeof NewProject>;
export type Project = v.InferOutput<typeof Project>;
export type ProjectDatabase = v.InferOutput<typeof ProjectDatabase>;
