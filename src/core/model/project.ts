import * as v from 'valibot';
import * as table from '$lib/db/schema';
import { createSelectSchema } from 'drizzle-valibot';
import { Provider } from '$lib/db/schema';

export const ProjectDatabase = createSelectSchema(table.project);
export const Project = v.object({
	...v.omit(ProjectDatabase, ['userId']).entries,
	provider: v.enum(Provider)
});
export const NewProject = v.object({
	...v.pick(Project, ['repoId', 'repo', 'owner', 'url']).entries,
	name: v.optional(v.string()),
	url: v.pipe(v.string(), v.url(), v.startsWith('http')),
	description: v.optional(v.string())
});

export type NewProject = v.InferOutput<typeof NewProject>;
export type Project = v.InferOutput<typeof Project>;
export type ProjectDatabase = v.InferOutput<typeof ProjectDatabase>;
