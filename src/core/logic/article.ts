export const pathToFileId = (path: string) => Buffer.from(path).toString('base64url');

export const fileIdToPath = (id: string) => Buffer.from(id, 'base64url').toString('utf8');

export const flatMeta = (
	meta: Record<string, unknown>,
	parentKey: string = ''
): Record<string, unknown> => {
	return Object.entries(meta).reduce((acc, [key, value]) => {
		if (
			typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value) &&
			!(value instanceof Date)
		) {
			return { ...acc, ...flatMeta(value as Record<string, unknown>, `${parentKey}${key}.`) };
		}
		return { ...acc, [`${parentKey}${key}`]: value };
	}, {});
};
