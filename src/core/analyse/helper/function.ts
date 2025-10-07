import type {
	ArrowFunctionExpression,
	BlockStatement,
	Expression,
	FunctionDeclaration,
	FunctionExpression,
	ReturnStatement,
	Statement,
	Node,
	CallExpression
} from 'acorn';
import { isCallExpression, isIdentifier } from './ast';

export type FunctionNode = FunctionDeclaration | FunctionExpression | ArrowFunctionExpression;

export const isFunctionCall = (node: Node, name?: string): node is CallExpression => {
	return (
		isCallExpression(node) && (!name || (isIdentifier(node.callee) && node.callee.name === name))
	);
};

// Check if node is a return statement
function isReturnStatement(node: Statement): node is ReturnStatement {
	return node.type === 'ReturnStatement';
}

// Get return value from block statement body
function getReturnFromBlockStatement(body: BlockStatement): Expression | null {
	for (const statement of body.body) {
		if (isReturnStatement(statement) && statement.argument) {
			return statement.argument;
		}
	}
	return null;
}

export const isFunctionNode = (node: Node): node is FunctionNode => {
	return (
		node.type === 'FunctionExpression' ||
		node.type === 'ArrowFunctionExpression' ||
		node.type === 'FunctionDeclaration'
	);
};

// Main function to get return value from any function
export function getFunctionReturnValue(functionNode: FunctionNode): Expression | null {
	// Arrow function with expression body (no braces)
	if (functionNode.type === 'ArrowFunctionExpression' && functionNode.expression) {
		return functionNode.body as Expression;
	}

	// Function with block statement body
	if (functionNode.body.type === 'BlockStatement') {
		return getReturnFromBlockStatement(functionNode.body);
	}

	return null;
}
