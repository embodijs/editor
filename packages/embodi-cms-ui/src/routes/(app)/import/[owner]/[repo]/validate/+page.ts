import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const load = async () => {
		const response: Response = await fetch(url);
		if (response.ok) {
			return true;
		} else {
			return false;
		}
	};
	return { hasValidConfig: load() };
};
