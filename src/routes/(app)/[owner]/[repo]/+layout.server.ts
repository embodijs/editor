import type { LayoutServerLoad } from './$types';
import { assertProject } from '$/lib/server/guards';
import { extractCollectionsTitles } from '$core/logic/config';

export const load: LayoutServerLoad = async ({ locals }) => {
	assertProject(locals);
	const collections = extractCollectionsTitles(locals.session.activeProjectConfig);
	return {
		collections
	};
};
