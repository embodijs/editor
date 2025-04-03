import { isAuthorized } from '$/lib/server/guards';
import { extractEmbodiConfig, isGitFile, loadEmbodiConfig } from '$core/logic/config';
import { createBaseGitRepo } from '$core/logic/repo';
import { createInternalGitUser } from '$core/logic/user';
import { getProjects } from '$services/project';
import { getRepoContentFromGithub } from '$services/repo';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { updateSession } from '$services/session';

export const load: PageServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const { user } = locals;

	const projects = await getProjects(user.id);

	return {
		projects
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

		const gitUser = createInternalGitUser(locals);
		const gitRepo = createBaseGitRepo({
			owner,
			repo
		});

		const gitFile = await loadEmbodiConfig((path: string) =>
			getRepoContentFromGithub(path, gitRepo, gitUser)
		);

		if (!isGitFile(gitFile)) {
			error(403, 'Valid Config is missing in the repository');
		}

		const config = extractEmbodiConfig(gitFile);

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
