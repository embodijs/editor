import { generateState } from 'arctic';
import { github } from '$services/oauth';

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const state = generateState();
	const scopes = ['user:email', 'repo', 'read:org'];
	const url = github.createAuthorizationURL(state, scopes);

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'strict'
	});

	return redirect(302, url.toString());
};
