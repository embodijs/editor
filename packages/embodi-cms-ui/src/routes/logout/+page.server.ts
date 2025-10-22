import { deleteSessionTokenCookie, invalidateSession } from '$services/session';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getDb } from '$/lib/db/index.server';

export const actions: Actions = {
	default: async (event) => {
		const { locals, platform } = event;
		const { session } = locals;
		if (!session) {
			throw redirect(302, '/auth');
		}
		deleteSessionTokenCookie(event);
		const dbConnection = getDb(platform?.env);
		await invalidateSession(dbConnection, session.id);
		return { success: true };
	}
};
