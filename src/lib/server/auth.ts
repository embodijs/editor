import type { SessionValidationResult } from '$services/session';
import { error } from '@sveltejs/kit';

export function isAuthorized(
	locals: App.Locals
): asserts locals is {
	user: NonNullable<SessionValidationResult['user']>;
	session: NonNullable<SessionValidationResult['session']>;
} {
	if (locals.session == null || locals.user == null) {
		error(401, 'Not authenticated');
	}
}
