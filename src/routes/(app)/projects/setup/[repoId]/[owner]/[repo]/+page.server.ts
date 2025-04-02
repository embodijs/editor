import { hasValidConfig } from '$core/logic/config';
import { getRepoContentFromGithub } from '$services/repo';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAuthorized } from '$/lib/server/auth';
import { createBaseGitRepo } from '$core/logic/repo';
import { createInternalGitUser } from '$core/logic/user';
import { createProject } from '$services/project';
import { generateProject } from '$core/logic/project';

export const load: PageServerLoad = async ({ params, locals }) => {
	isAuthorized(locals);

	const { owner, repo } = params;
	const { user } = locals;

	const gitUser = createInternalGitUser(locals);
	const gitRepo = createBaseGitRepo(params);

	const isValid = await hasValidConfig((path: string) =>
		getRepoContentFromGithub(path, gitRepo, gitUser)
	);

	if (!isValid) {
		return { owner, repo };
	}

	const project = generateProject({
		...params
	});
	await createProject(project, user.id);

	redirect(302, `/${owner}/${repo}/`);
};
