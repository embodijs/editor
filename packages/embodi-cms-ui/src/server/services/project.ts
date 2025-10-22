import type { DatabaseConnection } from '$/lib/db/index.server';
import type { Project } from '$core/model/project';
import * as table from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const createProject = async (db: DatabaseConnection, data: Project, userId: string) => {
	await db.insert(table.project).values({
		...data,
		userId
	});
};

export const getProjects = async (db: DatabaseConnection, userId: string): Promise<Project[]> => {
	return db.select().from(table.project).where(eq(table.project.userId, userId)).all();
};

export const getProject = (db: DatabaseConnection, id: string): Promise<Project | undefined> => {
	return db.select().from(table.project).where(eq(table.project.id, id)).get();
};
