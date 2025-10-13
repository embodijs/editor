import { db } from '$lib/db/index.server';
import { user, type NewDatabaseUser } from '$lib/db/schema';
import type { User } from '$core/model/user';
import { eq } from 'drizzle-orm';

export function getUserByGithubId(id: string): Promise<User | undefined> {
	return db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			avatar: user.avatar
		})
		.from(user)
		.where(eq(user.githubId, id))
		.get();
}

export async function createUser(newUser: NewDatabaseUser): Promise<User> {
	const result = (await db.insert(user).values(newUser).returning({ insertedId: user.id }))[0];
	return {
		id: result.insertedId,
		name: newUser.name,
		email: newUser.email,
		avatar: newUser.avatar ?? null
	};
}
