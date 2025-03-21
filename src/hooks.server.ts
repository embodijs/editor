import { sequence } from '@sveltejs/kit/hooks';
import * as sessionService from '$services/session';
import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
const handleParaglide: Handle = i18n.handle();

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(sessionService.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await sessionService.validateSessionToken(sessionToken);
	if (session) {
		sessionService.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		sessionService.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
