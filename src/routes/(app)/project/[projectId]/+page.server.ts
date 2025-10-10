import { isAuthorized } from '$/lib/server/guards';
import { extractEmbodiConfig, isGitFile, loadEmbodiConfig } from '$core/logic/config';
import { createGitRepo } from '$core/logic/repo';
import { getInternalGitUser } from '$core/logic/user';
import { getProject } from '$services/project';
import { getRepoContentFromGithub } from '$services/repo';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { updateSession } from '$services/session';

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

		const gitUser = getInternalGitUser(locals);
		const gitRepo = createGitRepo({
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
