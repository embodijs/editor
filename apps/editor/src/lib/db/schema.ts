import type { EmbodiConfig } from '$core/model/config';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { lower } from './helper';
export enum Provider {
	GITHUB = 'github',
	GITLAB = 'gitlab'
}

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	githubId: text('github_id').notNull(),
	email: text('email').notNull(),
	avatar: text('avatar_url'),
	name: text('name').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	gitToken: text('git_token').notNull(),
	provider: text('provider', { enum: [Provider.GITHUB, Provider.GITLAB] }).notNull(),
	username: text('username').notNull(),
	activeProjectConfig: text('active_project_config', { mode: 'json' }).$type<EmbodiConfig>(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const project = sqliteTable(
	'project',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		name: text('name').notNull(),
		description: text('description'),
		owner: text('owner').notNull(),
		provider: text('provider', { enum: [Provider.GITHUB, Provider.GITLAB] }).notNull(),
		repo: text('repo').notNull(),
		repoId: text('repo_id').notNull(),
		url: text('url').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
	},
	(table) => [
		uniqueIndex('repoUniqueIndex').on(lower(table.provider), lower(table.owner), lower(table.repo))
	]
);

export type Session = InferSelectModel<typeof session>;

export type DatabaseUser = InferSelectModel<typeof user>;
export type NewDatabaseUser = InferInsertModel<typeof user>;
