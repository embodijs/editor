import * as table from '$lib/db/schema';
import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const UserSchema = v.pick(createSelectSchema(table.user), ['id', 'email', 'name', 'avatar']);

export const InternalGitUserSchema = v.object({
	id: v.string(),
	username: v.string(),
	token: v.string()
});

export type InternalGitUser = v.InferOutput<typeof InternalGitUserSchema>;
export type User = v.InferOutput<typeof UserSchema>;
export type NewUser = v.InferInput<typeof UserSchema>;

export const generateUserId = () => {
	const id = `user_${crypto.randomUUID()}`;
	return id;
};

export const createInternalGitUser = (user: User, session: table.Session): InternalGitUser => {
	return {
		id: user.id,
		username: session.username,
		token: session.gitToken
	};
};
