import { test, expect, describe } from 'vitest';
import { onProperty, parseObject } from './object';
import type { Property } from 'acorn';
import {
	codeToAST,
	isCallExpression,
	isIdentifier,
	isObjectExpression,
	isVariableDeclaration
} from './ast';

describe('parseObject ecosystem', () => {
	test('onProperty', () => {
		const ast = {
			type: 'Property',
			start: 137,
			end: 208,
			method: false,
			shorthand: false,
			computed: false,
			key: {
				type: 'Identifier',
				start: 137,
				end: 143,
				name: 'loader'
			},
			value: {
				type: 'CallExpression',
				start: 145,
				end: 208,
				callee: {
					type: 'Identifier',
					start: 145,
					end: 149,
					name: 'glob'
				}
			}
		};

		const runner = onProperty('loader', (node: Property) => {
			return node.value.type;
		});

		const notRun = onProperty('test', (node: Property) => {
			return node.value.type;
		});

		expect(runner(ast)).toBe('CallExpression');
		expect(notRun(ast)).toBeNull();
	});

	test('parseObject', () => {
		const code = `
const blog = {
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blogs" }),
  schema: ({ image }) => {}
}`;
		const ast = codeToAST(code);
		expect(isVariableDeclaration(ast.body[0])).toBeTruthy();

		if (!isVariableDeclaration(ast.body[0])) {
			throw new Error('Invalid variable declaration');
		}
		const declaration = ast.body[0].declarations[0].init;
		expect(isObjectExpression(declaration!)).toBeTruthy();
		const runner = onProperty('loader', (node: Property) => {
			const { value } = node;
			if (isCallExpression(value) && isIdentifier(value.callee)) {
				return value.callee.name;
			}

			return null;
		});
		if (!isObjectExpression(declaration!)) {
			throw new Error('Invalid object expression');
		}
		expect(parseObject(declaration, [runner])).toEqual({ loader: 'glob' });
	});
});
