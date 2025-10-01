import type { Program } from 'acorn';
import {
	extractObjectMapping,
	getVariableExport,
	isIdentifier,
	isObjectExpression,
	isVariableDeclarator,
	isVariableExport,
	walkAST
} from './helper/ast';
import {
	getCollectionExport,
	isCollectionDefinition,
	isCollectionsExport,
	parseCollectionConfig
} from './helper/collection';

export const parseAstroContentDefinition = (ast: Program) => {
	// First pass: collect all defineCollection variables
	const definitions = new Map();
	const collections = [];

	walkAST(ast, (node, parent) => {
		if (
			parent &&
			isCollectionDefinition(node, parent) &&
			isObjectExpression(node.arguments[0]) &&
			isVariableDeclarator(parent) &&
			isIdentifier(parent.id)
		) {
			const varName = parent.id.name;
			const config = parseCollectionConfig(node.arguments[0]);
			if (config) definitions.set(varName, config);
		} else if (isVariableExport(node, 'collections')) {
			const exportObject = getVariableExport(node);
			if (!exportObject || !isObjectExpression(exportObject)) {
				return null;
			}
			const mapping = extractObjectMapping(exportObject);
			Object.entries(mapping).forEach(([exportedName, node]) => {
				if (isIdentifier(node)) {
					const varName = node.name;
					if (definitions.has(varName)) {
						collections.push({ ...definitions.get(varName), name: exportedName });
					} else if (isObjectExpression(node)) {
						const config = parseCollectionConfig(node);
						if (config) {
							collections.push({ ...config, name: exportedName });
						}
					}
				}
			});
		}
	});

	return collections;
};
