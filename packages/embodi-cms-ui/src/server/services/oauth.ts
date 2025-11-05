import { GitHub } from 'arctic';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';
export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, null);

const OAUTH_STATE_KEY = 'github_oauth_state';

export const setOauthStateCookie = (event: RequestEvent, state: string) => {
	event.cookies.set(OAUTH_STATE_KEY, state, {
		httpOnly: true,
		maxAge: 60 * 10,
		secure: import.meta.env.PROD,
		path: '/',
		sameSite: 'lax'
	});
};

export const getOauthStateCookie = (event: RequestEvent) => {
	return event.cookies.get(OAUTH_STATE_KEY) ?? null;
};
