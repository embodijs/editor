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
		console.log(tokens.scopes());
	} catch (error) {
		// Invalid code or client credentials
		console.info(error);
		return new Response(null, {
			status: 400
		});
	}
	const accessToken = tokens.accessToken();
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const githubUser = await githubUserResponse.json();

	const existingUser = await getUserByGithubId(githubUser.id);
	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, {
			userId: existingUser.id,
			gitToken: accessToken,
			username: githubUser.login
		});
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
	const session = await createSession(sessionToken, user.id, githubUser.access_token);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
