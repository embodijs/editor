import { isAuthorized } from '$/lib/server/guards';
import { createInternalGitUser } from '$core/logic/user';
import { getPagesConfig } from '$services/pages';
import { getRepoMeta } from '$services/repo';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { NewProject } from '$core/model/project';

export const load: PageServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);
	const { owner, repo } = params;
	const user = createInternalGitUser(locals);

	const meta = await getRepoMeta(user, owner, repo);
	const pages = meta.hasPages ? await getPagesConfig(user, owner, repo) : null;

	const form = await superValidate(
		{
			name: meta.name,
			description: meta.description,
			owner: owner,
			repo: repo,
			url: pages?.url.url
		},
		valibot(NewProject),
		{
			errors: false
		}
	);
	return { form, hasPages: meta.hasPages };
};
