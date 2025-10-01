import type { CallExpression, ObjectExpression, Property } from 'acorn';
import {
	extractValue,
	getAttributes,
	isCallExpression,
	isFunctionCall,
	isIdentifier,
	isObjectExpression,
	isVariableDeclarator,
	onProperty,
	parseObject,
	type Node
} from './ast';

export type Loader =
	| {
			type: 'glob';
			dir: string;
			pattern: string;
	  }
	| {
			type: 'file';
			file: string;
	  };

export type Collection = {
	loader: Loader;
};

export const isCollectionDefinition = (node: Node, parent: Node): node is CallExpression => {
	return isFunctionCall(node, 'defineCollection') && isVariableDeclarator(parent);
};

export const parseCollectionConfig = (node: ObjectExpression) => {
	const config = parseObject(node, [onProperty('loader', parseLoader)]);

	return config;
};

// export const isLoaderSupported = (node: Node) => {
// 	if (isCallExpression(node) && isIdentifier(node.callee)) {
// 		const type = node.callee.name;
// 		return type === 'glob' || type === 'file';
// 	}

// 	return false;
// };

const parseGlobLoader = (node: CallExpression) => {
	const definition = node.arguments[0];
	if (!isObjectExpression(definition)) {
		return null;
	}
	const attr = getAttributes(definition);

	return { type: 'glob', dir: attr.base, pattern: attr.pattern };
};

const parseFileLoader = (node: CallExpression) => {
	const file = extractValue(node.arguments[0]);
	if (file == null) {
		return null;
	}
	return { type: 'file', file };
};

const parseLoader = (node: Property) => {
	if (isCallExpression(node.value)) {
		const functionCall = node.value;
		if (!isIdentifier(functionCall.callee)) {
			return null;
		}
		const type = functionCall.callee.name;
		if (type === 'glob') {
			return parseGlobLoader(functionCall);
		} else if (type === 'file') {
			return parseFileLoader(functionCall);
		} else {
			return null;
		}
	}

	return null;
};
