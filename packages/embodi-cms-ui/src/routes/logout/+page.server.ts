import { deleteSessionTokenCookie, invalidateSession } from '$services/session';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event;
		const { session } = locals;
		if (!session) {
			throw redirect(302, '/auth');
		}
		deleteSessionTokenCookie(event);
		await invalidateSession(session.id);
		return { success: true };
	}
};
