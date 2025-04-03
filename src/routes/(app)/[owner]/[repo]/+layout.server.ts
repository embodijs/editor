import type { LayoutServerLoad } from './$types';
import { hasProject, isAuthorized } from '$/lib/server/guards';
import {
	extractCollectionsTitles,
	extractEmbodiConfig,
	isGitFile,
	loadEmbodiConfig
} from '$core/logic/config';
import { createInternalGitUser } from '$core/logic/user';
import { createBaseGitRepo } from '$core/logic/repo';
import { getRepoContentFromGithub } from '$services/repo';
import { error } from '@sveltejs/kit';
import { updateSession } from '$services/session';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	if (
		hasProject(locals) &&
		locals.session.activeProjectConfig.owner === params.owner &&
		locals.session.activeProjectConfig.repo === params.repo
	) {
		const collections = extractCollectionsTitles(locals.session.activeProjectConfig);
		return {
			collections
		};
	}

	isAuthorized(locals);
	const { owner, repo } = params;
	const gitUser = createInternalGitUser(locals);
	const gitRepo = createBaseGitRepo(params);

	const gitFile = await loadEmbodiConfig((path: string) =>
		getRepoContentFromGithub(path, gitRepo, gitUser)
	);

	if (!isGitFile(gitFile)) {
		error(403, 'Valid Config is missing in the repository');
	}

	const config = extractEmbodiConfig(gitFile);

	const collections = extractCollectionsTitles(config);

	await updateSession({
		...locals.session,
		activeProjectConfig: {
			...config,
			owner,
			repo
		}
	});

	return {
		collections
	};
};
