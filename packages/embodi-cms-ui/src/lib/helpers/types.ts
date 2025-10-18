export type PickRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type PickNonNullable<T, K extends keyof T> = Omit<T, K> & {
	[P in keyof Pick<T, K>]-?: NonNullable<T[P]>;
};

export type ExtractGuardType<T> = T extends (node: unknown, ...args: unknown[]) => node is infer R
	? R
	: never;

export type MaybePromise<T> = T | Promise<T>;
