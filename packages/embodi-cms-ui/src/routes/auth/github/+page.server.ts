import { generateState } from 'arctic';
import { github, setOauthStateCookie } from '$services/oauth';

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const state = generateState();
	const scopes = ['user:email', 'repo', 'read:org'];
	const url = github.createAuthorizationURL(state, scopes);
	await setOauthStateCookie(event, state);

	return redirect(302, url);
};
