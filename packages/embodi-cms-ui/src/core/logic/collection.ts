import {
	type FormInputField,
	type Loader,
	NumberField,
	StringField,
	DateField,
	BooleanField,
	ImageField,
	ObjectField,
	ArrayField,
	EnumField,
	GlobLoader
} from '$core/model/collection';
import { GitDirContent, GitDirMeta, GitFileMeta } from '$core/model/content';
import * as v from 'valibot';
import { minimatch } from 'minimatch';
import { twoDigit } from './date';

export const isNumberField = (field: FormInputField): field is NumberField =>
	field.type === 'number';
export const isStringField = (field: FormInputField): field is StringField =>
	field.type === 'string';
export const isDateField = (field: FormInputField): field is DateField => field.type === 'date';
export const isBooleanField = (field: FormInputField): field is BooleanField =>
	field.type === 'boolean';
export const isImageField = (field: FormInputField): field is ImageField => field.type === 'image';
export const isObjectField = (field: FormInputField): field is ObjectField =>
	field.type === 'object';
export const isArrayField = (field: FormInputField): field is ArrayField => field.type === 'array';
export const isEnumField = (field: FormInputField): field is EnumField => field.type === 'enum';

const handleOptional = <T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	field: FormInputField,
	schema: T,
	defaultValue?: unknown
) => {
	if (field.optional) {
		return v.optional(schema, field.default ?? defaultValue);
	} else if (field.default) {
		return v.optional(schema, field.default);
	}
	return schema;
};

export const parseString: Transformer = (field) => {
	if (!isStringField(field)) {
		return null;
	}
	const deepParams: v.BaseValidation<string, string, v.BaseIssue<unknown>>[] = [];
	if (field.minLength) {
		deepParams.push(v.minLength(field.minLength));
	} else if (field.maxLength) {
		deepParams.push(v.maxLength(field.maxLength));
	} else if (field.pattern === 'email') {
		deepParams.push(v.email());
	} else if (field.pattern === 'url') {
		deepParams.push(v.url());
	}
	return handleOptional(field, v.pipe(v.string(), ...deepParams));
};

const parseNumber: Transformer = (field) => {
	if (!isNumberField(field)) {
		return null;
	}
	const deepParams: v.BaseValidation<number, number, v.BaseIssue<unknown>>[] = [];
	if (field.min) {
		deepParams.push(v.minValue(field.min));
	} else if (field.max) {
		deepParams.push(v.maxValue(field.max));
	}
	return handleOptional(field, v.pipe(v.number(), ...deepParams));
};

const convertToIsoDate = (value: number | string) => {
	const date = new Date(value);
	return `${date.getFullYear()}-${twoDigit(date.getMonth() + 1)}-${twoDigit(date.getDate())}`;
};

const parseDate: Transformer = (field) => {
	if (!isDateField(field)) {
		return null;
	}
	return handleOptional(
		field,
		v.pipe(
			v.string(),
			v.isoDate(),
			field.min ? v.minValue(convertToIsoDate(field.min)) : v.check<string>(() => true),
			field.max ? v.maxValue(convertToIsoDate(field.max)) : v.check<string>(() => true)
		)
	);
};

const parseArray: Transformer = (field) => {
	if (!isArrayField(field)) {
		return null;
	}
	const itemSchema = runSchemaTransformer(field.items);
	if (!itemSchema) {
		return null;
	}
	return handleOptional(field, v.array(itemSchema));
};

const parseObject: Transformer = (field) => {
	if (!isObjectField(field)) {
		return null;
	}

	const objectSchema = field.fields.reduce(
		(acc, field) => {
			const transformed = runSchemaTransformer(field);
			if (transformed) {
				return { ...acc, [field.fieldName]: transformed };
			}
			return acc;
		},
		{} as Record<string, v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>
	);
	return handleOptional(field, v.object(objectSchema));
};

const parserBoolean: Transformer = (field) => {
	if (!isBooleanField(field)) {
		return null;
	}
	return handleOptional(field, v.boolean(), false);
};

const parseImage: Transformer = (field) => {
	if (!isImageField(field)) {
		return null;
	}
	return handleOptional(field, v.string());
};

const parseEnum: Transformer = (field) => {
	if (!isEnumField(field)) {
		return null;
	}
	return handleOptional(field, v.enum(field.options));
};

type Transformer = (
	field: FormInputField
) => v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>> | null;

const transformer: Array<Transformer> = [
	parseString,
	parseNumber,
	parseDate,
	parseObject,
	parseArray,
	parserBoolean,
	parseImage,
	parseEnum
];

const runSchemaTransformer = (field: FormInputField) => {
	for (const parser of transformer) {
		const result = parser(field);
		if (result) {
			return result;
		}
	}
	return null;
};

export const convertMetaFiledsToValibotSchmea = (fields: FormInputField[]) => {
	const objectSchema = fields.reduce(
		(acc, field) => {
			const schema = runSchemaTransformer(field);
			if (schema) {
				return { ...acc, [field.fieldName]: schema };
			}
			return acc;
		},
		{} as Record<string, v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>
	);
	return v.object(objectSchema);
};

export const getCollectionContent = async (
	loader: GlobLoader,
	services: { getContent: (path: string) => Promise<GitDirContent[]> }
): Promise<GitFileMeta[]> => {
	const basePath = loader.base?.replace('./', '') ?? '';
	const content = await services.getContent(basePath);
	const [files] = content.reduce(
		(acc, item) => {
			if (item.type === 'file' && minimatch(item.path, loader.pattern)) {
				acc[0] = [...acc[0], item];
			} else if (item.type === 'dir') {
				acc[1] = [...acc[1], item];
			}
			return acc;
		},
		[[], []] as [GitFileMeta[], GitDirMeta[]]
	);
	return files;
};

export const getDirPath = (loader: Loader) => {
	if (loader.type === 'glob') {
		return loader.base ?? '';
	} else {
		return loader.path.split('/').slice(0, -1).join('/');
	}
};
