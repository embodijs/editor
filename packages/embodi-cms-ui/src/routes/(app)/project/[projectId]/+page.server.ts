import { isAuthorized } from '$/lib/server/guards';
import { createGitRepo } from '$core/logic/repo';
import { getProject } from '$services/project';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { updateSession } from '$services/session';
import { getProjectConfig } from '$layer/project';

export const load: PageServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);
	const { projectId } = params;

	const project = await getProject(projectId);

	return {
		project
	};
};

export const actions = {
	open: async ({ request, locals }) => {
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

		await updateSession({
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
