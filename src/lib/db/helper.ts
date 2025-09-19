import { sql, type SQL } from 'drizzle-orm';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export function lower(email: AnySQLiteColumn): SQL {
	return sql`lower(${email})`;
}
