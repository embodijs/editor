import { isAuthorized } from '$/lib/server/guards';
import { getInternalGitUser } from '$core/logic/user';
import { getPagesConfig } from '$services/pages';
import { getRepoMeta } from '$services/repo';
import { createProject } from '$services/project';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { NewProject } from '$core/model/project';
import { generateProject } from '$core/logic/project';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	isAuthorized(locals);
	const { owner, repo } = params;
	const user = getInternalGitUser(locals);

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

export const actions: Actions = {
	async default({ request, locals }) {
		isAuthorized(locals);
		const form = await superValidate(request, valibot(NewProject));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { user, session } = locals;
		// TODO: Compare Repo Owner from url with form
		const project = generateProject(form.data, session.provider);
		await createProject(project, user.id);

		return redirect(302, `/project/${project.id}`);
	}
};
