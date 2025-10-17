export const generateRandomHash = (): string => {
	const array = new Uint32Array(10);
	return crypto.getRandomValues(array).toString('hex');
};
