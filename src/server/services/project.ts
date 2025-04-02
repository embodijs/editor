import type { Project } from '$core/model/project';
import * as table from '$lib/db/schema';
import { db } from '$lib/db/index.server';
import { eq } from 'drizzle-orm';

export const createProject = async (data: Project, userId: string) => {
	await db.insert(table.project).values({
		...data,
		userId
	});
};

export const getProjects = async (userId: string): Promise<Project[]> => {
	return db.select().from(table.project).where(eq(table.project.userId, userId)).all();
};
