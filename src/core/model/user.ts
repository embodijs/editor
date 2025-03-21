import { user } from '$lib/db/schema';
import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const UserSchema = v.pick(createSelectSchema(user), ['id', 'email', 'name', 'avatar']);

export const generateUserId = () => {
	const id = `user_${crypto.randomUUID()}`;
	return id;
};

export type User = v.InferOutput<typeof UserSchema>;
export type NewUser = v.InferInput<typeof UserSchema>;
