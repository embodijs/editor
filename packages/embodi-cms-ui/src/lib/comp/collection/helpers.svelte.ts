import { camelToReadable } from '$/lib/helpers/string';
import type { MetaInputField } from '$core/model/collection';
import { getLocale } from '$/lib/paraglide/runtime';

export const getLabel = ({ displayName, fieldName }: MetaInputField): string => {
	if (displayName != null) {
		if (typeof displayName === 'string') {
			return displayName;
		}
		const local = getLocale();
		if (displayName[local]) {
			return displayName[local];
		} else {
			return Object.entries(displayName)[0][1];
		}
	}
	return camelToReadable(fieldName);
	// const nameParts = [...objectPath.slice(excludeFirstFromName ? 1 : 0), fieldName];
	// const label = nameParts.map((word) => camelToReadable(word)).join(' ');
	// return label;
};

export const getPathValue = (data: unknown, path: (string | number)[]): unknown => {
	if (data == null) {
		return undefined;
	}
	if (path.length === 0) {
		return data;
	}
	const [next, ...rest] = path;
	return getPathValue((data as Record<string, unknown>)[next], rest);
};

const getArraySlice = (
	data: Array<unknown> | undefined,
	start: number,
	end?: number
): Array<unknown> => {
	if (!data || start === end || (end && end > data.length)) {
		return [];
	}
	return data.slice(start, end);
};

export const setPathValue = <T = unknown>(
	data: T,
	path: (string | number)[],
	value: unknown
): T => {
	if (path.length === 0) {
		return value as T;
	}
	const [next, ...rest] = path;
	if (typeof next === 'number') {
		return [
			...getArraySlice(data as Array<unknown>, 0, next),
			setPathValue((data as Array<unknown>)?.[next], rest, value),
			...getArraySlice(data as Array<unknown>, next + 1)
		] as T;
	}
	return {
		...(data as Record<string, unknown>),
		[next]: setPathValue((data as Record<string, unknown>)[next], rest, value)
	} as T;
};
