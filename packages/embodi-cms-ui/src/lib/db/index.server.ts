import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { getPlatformProxy } from 'wrangler';

const { env } = await getPlatformProxy();
if (!env.DB) throw new Error('DB is not set');

export const db = drizzle(env.DB, {
	schema
});
