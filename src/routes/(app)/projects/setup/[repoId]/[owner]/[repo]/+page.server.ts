import { extractEmbodiConfig, isGitFile, loadEmbodiConfig } from '$core/logic/config';
import { getRepoContentFromGithub } from '$services/repo';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAuthorized } from '$/lib/server/guards';
import { createBaseGitRepo } from '$core/logic/repo';
import { createInternalGitUser } from '$core/logic/user';
import { createProject } from '$services/project';
import { generateProject } from '$core/logic/project';
import { updateSession } from '$services/session';

export const load: PageServerLoad = async ({ params, locals }) => {
	isAuthorized(locals);

	const { owner, repo } = params;
	const { user, session } = locals;

	const gitUser = createInternalGitUser(locals);
	const gitRepo = createBaseGitRepo(params);

	const gitFile = await loadEmbodiConfig((path: string) =>
		getRepoContentFromGithub(path, gitRepo, gitUser)
	);

	if (!isGitFile(gitFile)) {
		return { owner, repo };
	}

	const config = extractEmbodiConfig(gitFile);

	const project = generateProject({
		...params
	});
	await createProject(project, user.id);
	await updateSession({
		...session,
		activeProjectConfig: config
	});

	redirect(302, `/${owner}/${repo}/`);
};
