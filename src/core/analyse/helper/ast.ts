import type { ExportNamedDeclaration } from 'acorn';
import {
	parse,
	type Node,
	type Literal,
	type CallExpression,
	type VariableDeclaration,
	type VariableDeclarator,
	type ObjectExpression,
	type Identifier,
	type Property
} from 'acorn';
// import tsPlugin from 'acorn-typescript';
export type { Node };

export type ASTNode = Record<string, unknown>;

export const codeToAST = (code: string) =>
	parse(code, {
		ecmaVersion: 'latest',
		sourceType: 'module'
	});

export const walkAST = (
	node: Node,
	callback: (node: Node, parent: Node | null) => void,
	parent: Node | null = null
): void => {
	callback(node, parent);

	Object.entries(node).forEach(([key, value]) => {
		if (key === 'parent') {
			return;
		}
		if (typeof value === 'object' && value !== null) {
			walkAST(value, callback, node);
		} else if (Array.isArray(value)) {
			value.forEach((item) => {
				if (typeof item === 'object' && item !== null) {
					walkAST(item, callback, node);
				}
			});
		}
	});
};

export const isLiteral = (node: Node): node is Literal => {
	return node.type === 'Literal';
};

export const isProperty = (node: Node): node is Property => {
	return node.type === 'Property';
};

export const isIdentifier = (node: Node): node is Identifier => {
	return node.type === 'Identifier';
};

export const isObjectExpression = (node: Node): node is ObjectExpression => {
	return node.type === 'ObjectExpression';
};

export const isCallExpression = (node: Node): node is CallExpression => {
	return node.type === 'CallExpression';
};

export const extractValue = (
	node: Node
): string | boolean | null | number | RegExp | bigint | undefined => {
	if (isLiteral(node)) {
		return node.value;
	}
	return undefined;
};

export const isFunctionCall = (node: Node, name?: string): node is CallExpression => {
	return (
		isCallExpression(node) && (!name || (isIdentifier(node.callee) && node.callee.name === name))
	);
};

export const isVariableDeclaration = (node: Node): node is VariableDeclaration => {
	return node.type === 'VariableDeclaration';
};

export const isVariableDeclarator = (node: Node, name?: string): node is VariableDeclarator => {
	if (name && node.type === 'VariableDeclarator') {
		const variable = node as VariableDeclarator;
		return isIdentifier(variable.id) && variable.id.name === name;
	}
	return node.type === 'VariableDeclarator';
};

export const isExportNamedDeclaration = (node: Node): node is ExportNamedDeclaration => {
	return node.type === 'ExportNamedDeclaration';
};

export const isVariableExport = (node: Node, name?: string): node is ExportNamedDeclaration => {
	return (
		isExportNamedDeclaration(node) &&
		!!node.declaration &&
		isVariableDeclaration(node.declaration) &&
		isVariableDeclarator(node.declaration.declarations?.[0], name)
	);
};

export const getVariableExport = (node: Node) => {
	if (
		isExportNamedDeclaration(node) &&
		node.declaration &&
		isVariableDeclaration(node.declaration)
	) {
		const declaration = node.declaration.declarations?.[0];
		if (declaration && isVariableDeclarator(declaration)) {
			return declaration.init;
		}
	}
	return null;
};

export const getAttributeName = (node: Property): string | null => {
	if (node.key.type === 'Identifier' && !node.computed) {
		return node.key.name;
	} else if (node.key.type === 'Literal' && typeof node.key.value === 'string') {
		return node.key.value;
	}
	return null;
};

export const extractObjectMapping = (node: ObjectExpression): Record<string, Node> => {
	return node.properties.reduce((mapping, prop) => {
		if (!isProperty(prop)) {
			return mapping;
		}

		// blogs: blogsCollection
		const key = getAttributeName(prop);
		if (!key) {
			return mapping;
		}
		return {
			...mapping,
			[key]: prop.value
		};
	}, {});
};

export const getAttributeValue = (node: Property): string | null => {
	if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
		return node.value.value;
	}
	return null;
};

export function getAttributesAsEntries(node: ObjectExpression) {
	return node.properties.reduce(
		(acc, element) => {
			if (!isProperty(element)) {
				return acc;
			}
			const key = getAttributeName(element);
			const value = getAttributeValue(element);
			if (key !== null && value !== null) {
				acc.push([key, value]);
			}
			return acc;
		},
		[] as Array<[string, string | boolean | bigint | number]>
	);
}

export const getAttributes = (node: ObjectExpression) => {
	return Object.fromEntries(getAttributesAsEntries(node));
};

/**
 * Object parser
 *
 *
 *
 */

export const onProperty = (name: string, parser: (node: Property) => unknown) => (node: Node) => {
	if (isProperty(node) && isIdentifier(node.key) && node.key.name === name) {
		return parser(node);
	}
	return null;
};

const runParser = <T = unknown>(node: Node, parsers: Array<(node: Node) => T>): T | null => {
	for (const parser of parsers) {
		const result = parser(node);
		if (result != null) {
			return result;
		}
	}
	return null;
};

export const parseObject = <T = unknown>(
	node: ObjectExpression,
	parsers: Array<(node: Node) => T>
): Record<string, T> => {
	return Object.fromEntries(
		node.properties.reduce(
			(acc, element) => {
				if (!isProperty(element)) {
					return acc;
				}
				const value = runParser(element, parsers);
				const key = getAttributeName(element);
				if (key == null || value == null) {
					return acc;
				}

				return [...acc, [key, value]];
			},
			[] as Array<[string, T]>
		)
	);
};
