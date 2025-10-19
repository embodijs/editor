import type { LayoutServerLoad } from './$types';
import { isAuthorized } from '$/lib/server/guards';
import { getUser } from '$core/logic/user.js';

export const load: LayoutServerLoad = async ({ locals }) => {
	isAuthorized(locals);
	const user = getUser(locals);
	return {
		user
	};
};
