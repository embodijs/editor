import type { LayoutServerLoad } from './$types';
import { isAuthorized } from '$/lib/server/guards';

export const load: LayoutServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const { user } = locals;
	return {
		user
	};
};
