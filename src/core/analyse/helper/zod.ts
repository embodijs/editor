import type {
	Identifier,
	MemberExpression,
	Node,
	Property,
	CallExpression,
	ObjectExpression
} from 'acorn';
import { isCallExpression, isIdentifier, isMemberExpression } from './ast';
import { getFunctionReturnValue, isFunctionNode } from './function';
import { onValueType, parseObject } from './object';
import type { MetaInputField } from '$core/model/collection';

interface ZodExpression extends CallExpression {
	callee: MemberExpression & {
		object: Identifier & { name: 'z' };
		property: Identifier;
	};
}

interface ZodObjectExpression extends CallExpression {
	callee: MemberExpression & {
		object: Identifier & { name: 'z' };
		property: Identifier & { name: 'object' };
	};
}

export const isZodExpression = (node: Node): node is ZodExpression => {
	if (isCallExpression(node) && isMemberExpression(node.callee)) {
		if (isCallExpression(node.callee.object)) {
			return isZodExpression(node.callee.object);
		}
		return isIdentifier(node.callee.object, 'z');
	}

	return false;
};

export const extractZodValidations = (node: ZodExpression, list: string[] = []): string[] => {
	list.push(node.callee.property.name);
	if (isCallExpression(node.callee.object)) {
		extractZodValidations(node.callee.object, list);
	}
	return list;
};

export const isZodObjectExpression = (node: Node): node is ZodObjectExpression => {
	return isZodExpression(node) && (node.callee.property as Identifier).name === 'object';
};

export const getZodObjectParam = (node: ZodObjectExpression): ObjectExpression => {
	return node.arguments[0] as ObjectExpression;
};

export const translateZodValidation = (node: ZodExpression): MetaInputField => {
	const zodValidationTypes = extractZodValidations(node);
	return zodValidationTypes.reduce((meta, type, index, array) => {
		if (type === 'email') {
			return {
				...meta,
				type: 'text',
				validator: 'email'
			};
		} else if (type === 'optional') {
			return {
				...meta,
				required: false
			};
		} else if (type === 'min' && (array.includes('string') || meta.type === 'text')) {
			return {
				...meta,
				minLength: parseInt(type.slice(3))
			};
		} else if (type === 'max') {
			meta.max = parseInt(type.slice(3));
			return meta;
		}
	}, {} as MetaInputField);
};

export const parseZodExpression = (node: Node) => {
	if (!isZodObjectExpression(node)) {
		return null;
	}
	const schemaNode = getZodObjectParam(node);
	parseObject(schemaNode, [
		onValueType(isZodExpression, (node: ZodExpression) => {
			const zodValidationTypes = extractZodValidations(node);
			//TODO: convert to MetaFields structures
		})
	]);
};

export const parseZodSchema = (node: Property) => {
	if (isFunctionNode(node.value)) {
		const { params } = node.value;
		const zodSchema = getFunctionReturnValue(node.value);
		if (!zodSchema) {
			return null;
		}
		return parseZodExpression(zodSchema);
	} else if (isCallExpression(node.value)) {
		return parseZodExpression(node.value);
	}

	return null;
};
