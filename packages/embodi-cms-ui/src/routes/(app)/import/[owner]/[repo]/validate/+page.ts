import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const load = async () => {
		const repsonse: Response = await fetch(url);
		if (repsonse.ok) {
			return { hasValidConfig: true };
		} else {
			return { hasValidConfig: false };
		}
	};
	return load();
};
