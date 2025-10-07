import type { Property, Node, ObjectExpression } from 'acorn';
import { getAttributeName, isIdentifier, isProperty } from './ast';

export const onProperty = (name: string, parser: (node: Property) => unknown) => (node: Node) => {
	if (isProperty(node) && isIdentifier(node.key) && node.key.name === name) {
		return parser(node);
	}
	return null;
};

export const onValueType =
	<T extends Node>(validator: (node: Node) => node is T, parser: (node: T) => unknown) =>
	(node: Node) => {
		if (validator(node)) {
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
