import { GitHub } from 'arctic';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';
export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, null);

const OAUTH_STATE_KEY = 'github_oauth_state';

export const setOauthStateCookie = async (event: RequestEvent, state: string) => {
	event.cookies.set(OAUTH_STATE_KEY, state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60,
		sameSite: 'strict'
	});
};

export const getOauthStateCookie = async (event: RequestEvent) => {
	return event.cookies.get(OAUTH_STATE_KEY) ?? null;
};
