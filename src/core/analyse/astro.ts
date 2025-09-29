import type { Program } from 'acorn';
import {
	isFunctionCall,
	isIdentifier,
	isObjectExpression,
	isVariableDeclaration,
	isVariableDeclarator,
	walkAST
} from './helper/ast';
import { definesCollection, parseCollectionConfig } from './helper/collection';

export const parseAstroContentDefinition = (ast: Program) => {
	// First pass: collect all defineCollection variables
	const definitions = new Map();

	walkAST(ast, (node, parent) => {
		if (
			parent &&
			definesCollection(node, parent) &&
			isObjectExpression(node.arguments[0]) &&
			isVariableDeclarator(parent) &&
			isIdentifier(parent.id)
		) {
			const varName = parent.id.name;
			const config = parseCollectionConfig(node.arguments[0]);
			console.log({ varName, config });
			if (config) definitions.set(varName, config);
		}
	});

	return definitions;
};
