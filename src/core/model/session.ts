import { session } from '$lib/db/schema';
import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const SessionSchema = createSelectSchema(session);

export type Session = v.InferOutput<typeof SessionSchema>;
