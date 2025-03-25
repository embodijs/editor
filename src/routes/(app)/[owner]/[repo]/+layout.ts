import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, data }) => {
	const { owner, repo } = params;

	return { current: { owner, repo }, ...data };
};
