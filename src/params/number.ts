import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is `${number}` => {
	return typeof Number(param) === 'number';
}) satisfies ParamMatcher;
