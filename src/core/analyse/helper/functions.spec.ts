import { test, expect, describe } from 'vitest';

import { isFunctionCall } from './function';

describe('AST base functions', () => {
	test('isFunctionCall to be valid', () => {
		const ast = {
			type: 'CallExpression',
			start: 116,
			end: 586,
			callee: {
				type: 'Identifier',
				start: 116,
				end: 132,
				name: 'defineCollection'
			}
		};

		expect(isFunctionCall(ast)).toBeTruthy();
		expect(isFunctionCall(ast, 'defineCollection')).toBeTruthy();
		expect(isFunctionCall(ast, 'soneCollection')).toBeFalsy();
	});

	test('isFunctionCall to be invalid', () => {
		const ast = {
			type: 'Property',
			start: 374,
			end: 410,
			method: false,
			shorthand: false,
			computed: false,
			key: {
				type: 'Identifier',
				start: 374,
				end: 378,
				name: 'tags'
			}
		};

		expect(isFunctionCall(ast)).toBeFalsy();
	});
});
