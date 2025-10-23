import { isAuthorized } from '$/lib/server/guards';
import { createGitRepo } from '$core/logic/repo';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { updateSession } from '$services/session';
import { getProjectConfig } from '$layer/project';
import { getDb } from '$/lib/db/index.server';
import { getProject } from '$services/project';

export const load: PageServerLoad = async ({ locals, params, platform }) => {
	isAuthorized(locals);
	const dbConnection = getDb(platform?.env);
	const project = await getProject(dbConnection, params.projectId);
	return { project };
};

export const actions = {
	open: async ({ request, locals, platform }) => {
		isAuthorized(locals);

		const formData = await request.formData();
		const owner = formData.get('owner')?.toString();
		const repo = formData.get('repo')?.toString();

		if (!owner || !repo) {
			return { error: 'Invalid form data' };
		}

		const gitRepo = createGitRepo({
			owner,
			repo
		});

		const config = getProjectConfig(gitRepo, locals);

		if (!config) {
			error(424, {
				type: 'Missing valid config',
				message: 'It seems your git repository does not contain a valid config file.'
			});
		}
		const dbConnection = getDb(platform?.env);
		await updateSession(dbConnection, {
			...locals.session,
			activeProjectConfig: {
				...config,
				owner,
				repo
			}
		});

		redirect(302, `/${owner}/${repo}`);
	}
} satisfies Actions;
