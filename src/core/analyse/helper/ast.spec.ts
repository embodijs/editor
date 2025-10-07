import { test, expect, describe } from 'vitest';
import { isVariableExport } from './ast';

describe('AST base functions', () => {
	test('isVariableExport', () => {
		const ast = {
			type: 'ExportNamedDeclaration',
			start: 589,
			end: 646,
			declaration: {
				type: 'VariableDeclaration',
				start: 596,
				end: 646,
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 602,
						end: 645,
						id: {
							type: 'Identifier',
							start: 602,
							end: 613,
							name: 'collections'
						},
						init: {}
					}
				]
			}
		};

		expect(isVariableExport(ast)).toBeTruthy();
		expect(isVariableExport(ast, 'collections')).toBeTruthy();
		expect(isVariableExport(ast, 'coll')).toBeFalsy();
	});
});
