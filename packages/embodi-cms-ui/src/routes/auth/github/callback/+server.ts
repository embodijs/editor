import { generateSessionToken, createSession, setSessionTokenCookie } from '$services/session';

import { getOauthStateCookie, github } from '$services/oauth';
import { createUser, getUserByGithubId } from '$services/user';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { generateUserId } from '$core/model/user';
import { getCurrentUser } from '$services/github/user';
import { Provider } from '$lib/db/schema';
import { getDb } from '$/lib/db/index.server';

export async function GET(event: RequestEvent): Promise<Response> {
	const { url, platform } = event;
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = getOauthStateCookie(event);
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
	const dbConnection = getDb(platform?.env);
	const existingUser = await getUserByGithubId(dbConnection, githubUser.id);
	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(dbConnection, sessionToken, {
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

	const user = await createUser(dbConnection, {
		id: generateUserId(),
		githubId: githubUser.id,
		name: githubUser.name ?? githubUser.login,
		email: githubUser.email,
		avatar: githubUser.avatarUrl
	});

	const sessionToken = generateSessionToken();
	const session = await createSession(dbConnection, sessionToken, {
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
