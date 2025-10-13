import * as table from '$lib/db/schema';
import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const User = v.pick(createSelectSchema(table.user), ['id', 'email', 'name', 'avatar']);

export enum PLATFORMS {
	GITHUB
}

export const InternalGitUser = v.object({
	id: v.string(),
	username: v.string(),
	email: v.pipe(v.string(), v.email()),
	platform: v.enum(PLATFORMS),
	token: v.string()
});

export type InternalGitUser = v.InferOutput<typeof InternalGitUser>;
export type User = v.InferOutput<typeof User>;
export type NewUser = v.InferInput<typeof User>;
export type Session = table.Session;

export const generateUserId = () => {
	const id = `user_${crypto.randomUUID()}`;
	return id;
};
