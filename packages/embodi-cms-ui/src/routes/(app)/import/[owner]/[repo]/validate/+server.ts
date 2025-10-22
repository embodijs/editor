import type { RequestHandler } from './$types';
import { isAuthorized } from '$/lib/server/guards';
import { createGitRepo } from '$core/logic/repo';
import { hasProjectConfig } from '$layer/project.js';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	isAuthorized(locals);

	const gitRepo = createGitRepo(params);
	const config = await hasProjectConfig(gitRepo, locals);

	if (!config) {
		error(404, {
			type: 'Missing config',
			message: 'It seems like your git repo does not have a project config.'
		});
	}

	return json(config);
};
