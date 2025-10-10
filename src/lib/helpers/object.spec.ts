import { describe, test, expect } from 'vitest';
import { removeEmpty } from './object';

describe('Test Object helpers', () => {
	test('removeUndefined', () => {
		const obj = { a: 1, b: undefined, c: 3 };
		expect(obj).not.toStrictEqual({ a: 1, c: 3 });
		const result = removeEmpty(obj);
		expect(result).toStrictEqual({ a: 1, c: 3 });
		expect(result).not.toStrictEqual({ a: 1, b: undefined, c: 3 });
	});
});
