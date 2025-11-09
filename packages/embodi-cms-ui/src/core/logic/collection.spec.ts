import * as v from 'valibot';
import { test, expect, describe } from 'vitest';
import { parseString } from './collection';

describe('Collection logic', () => {
	test('Convert Meta Input Text', () => {
		const schema = parseString({
			fieldName: 'name',
			displayName: 'Name',
			type: 'string',
			optional: false
		});

		expect(v.parse(schema!, 'string')).toBe('string');
		expect(() => v.parse(schema!, 7)).toThrow();
	});
});
