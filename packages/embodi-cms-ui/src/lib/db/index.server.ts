import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import assert from 'node:assert';

export const getDb = (env?: { DB: string }) => {
	assert(env, 'DB environment variable is not set');
	return drizzle(env.DB, {
		schema
	});
};

export type DatabaseConnection = ReturnType<typeof getDb>;
