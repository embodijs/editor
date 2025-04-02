import type { SessionValidationResult } from '$services/session';
import { error } from '@sveltejs/kit';
import type { Session } from '../db/schema';
import type { PickNonNullable } from '../helpers/types';

export function isAuthorized(locals: App.Locals): asserts locals is {
	user: NonNullable<SessionValidationResult['user']>;
	session: NonNullable<SessionValidationResult['session']>;
} {
	if (locals.session == null || locals.user == null) {
		error(401, 'Not authenticated');
	}
}

export function assertProject(locals: App.Locals): asserts locals is Omit<App.Locals, 'session'> & {
	session: PickNonNullable<Session, 'activeProjectConfig'>;
} {
	if (locals.session?.activeProjectConfig == null) {
		error(403, 'Project is not set');
	}
}

export function hasProject(locals: App.Locals): locals is Omit<App.Locals, 'session'> & {
	session: PickNonNullable<Session, 'activeProjectConfig'>;
} {
	if (locals.session?.activeProjectConfig == null) {
		return false;
	}
	return true;
}
