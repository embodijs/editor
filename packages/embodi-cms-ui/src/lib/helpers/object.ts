export const isRecord = (value: unknown): value is Record<string, unknown> => {
	if (typeof value !== 'object' || value === null) return false;
	return Object.getPrototypeOf(value) === Object.prototype;
};

export const hasAttributes = (obj: Record<string, unknown>): boolean => {
	return Object.keys(obj).length > 0;
};

export const removeEmpty = <T extends Record<string, unknown>>(obj: T): T => {
	return Object.fromEntries(
		Object.entries(obj)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => {
				if (isRecord(value)) {
					const cleaned = removeEmpty(value);
					if (hasAttributes(cleaned)) {
						return [key, cleaned];
					} else {
						return [key, undefined];
					}
				} else if (Array.isArray(value)) {
					return [
						key,
						value.map((item) => {
							if (isRecord(item)) {
								removeEmpty(item);
							}
							return item;
						})
					];
				}
				return [key, value];
			})
			.filter(([, value]) => value !== undefined)
	) as T;
};
