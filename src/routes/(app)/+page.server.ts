import { hasProject, isAuthorized } from '$/lib/server/guards';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	if (hasProject(locals)) {
		const { owner, repo } = locals.session.activeProjectConfig;
		if (owner && repo) {
			redirect(302, `/${owner}/${repo}`);
		}
	}

	redirect(302, '/projects');
};
