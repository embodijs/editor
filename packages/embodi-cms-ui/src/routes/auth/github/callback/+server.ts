import { generateSessionToken, createSession, setSessionTokenCookie } from '$services/session';

import { getOauthStateCookie, github } from '$services/oauth';
import { createUser, getUserByGithubId } from '$services/user';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { generateUserId } from '$core/model/user';
import { getCurrentUser } from '$services/github/user';
import { Provider } from '$lib/db/schema';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = await getOauthStateCookie(event);
	console.log({ state, storedState, code });
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
	} catch (error) {
		// Invalid code or client credentials
		console.info(error);
		return new Response(null, {
			status: 400
		});
	}
	const accessToken = tokens.accessToken();
	const githubUser = await getCurrentUser({ token: accessToken });
	const existingUser = await getUserByGithubId(githubUser.id);
	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, {
			userId: existingUser.id,
			gitToken: accessToken,
			provider: Provider.GITHUB,
			username: githubUser.login
		});
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
		name: githubUser.name ?? githubUser.login,
		email: githubUser.email,
		avatar: githubUser.avatarUrl
	});

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, {
		userId: user.id,
		gitToken: accessToken,
		provider: Provider.GITHUB,
		username: githubUser.login
	});
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
