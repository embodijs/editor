import { generateSessionToken, createSession, setSessionTokenCookie } from '$services/session';

import { github } from '$services/oauth';
import { createUser, getUserByGithubId } from '$services/user';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { generateUserId } from '$core/model/user';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = await githubUserResponse.json();

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserByGithubId(githubUser.id);
	console.log({ existingUser });
	if (existingUser) {
		const sessionToken = generateSessionToken();
		console.log({ sessionToken });
		const session = await createSession(sessionToken, existingUser.id);
		console.log({ session });
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser({
		id: generateUserId(),
		githubId: githubUser.id,
		name: githubUser.name,
		email: githubUser.email,
		avatar: githubUser.avatar_url
	});

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
