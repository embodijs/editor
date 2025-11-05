import * as v from 'valibot';

const FieldDisplayName = v.union([
	v.string(),
	v.record(v.pipe(v.string(), v.length(2)), v.string())
]);

const FieldBase = v.object({
	fieldName: v.optional(v.string()),
	displayName: v.optional(FieldDisplayName),
	description: v.optional(v.string()),
	optional: v.optional(v.boolean(), false),
	default: v.optional(v.any()),
	hidden: v.optional(v.boolean()),
	generate: v.optional(v.boolean())
});

export const NumberField = v.object({
	...FieldBase.entries,
	type: v.literal('number'),
	min: v.optional(v.number()),
	max: v.optional(v.number())
});

export type ArrayField = v.InferInput<typeof FieldBase> & {
	type: 'array';
	items: v.InferInput<typeof FormInputField>;
};

export const ArrayField: v.GenericSchema<ArrayField> = v.object({
	...FieldBase.entries,
	type: v.literal('array'),
	items: v.lazy(() => FormInputField)
});

export const EnumField = v.object({
	...FieldBase.entries,
	type: v.literal('enum'),
	options: v.record(v.string(), v.union([v.string(), v.number()]))
});

export const DateField = v.object({
	...FieldBase.entries,
	type: v.literal('date'),
	min: v.optional(v.pipe(v.string(), v.isoDate())),
	max: v.optional(v.pipe(v.string(), v.isoDate()))
});

export const StringField = v.object({
	...FieldBase.entries,
	type: v.literal('string'),
	minLength: v.optional(v.number()),
	maxLength: v.optional(v.number()),
	pattern: v.optional(
		v.union([
			v.literal('email'),
			v.literal('url'),
			v.literal('slug'),
			v.literal('uuid'),
			v.literal('uuid:v7'),
			v.literal('uuid:v4')
		])
	)
});

export const ImageField = v.object({
	...FieldBase.entries,
	type: v.literal('image')
});

export const UuidField = v.object({
	...FieldBase.entries,
	type: v.literal('uuid'),
	generated: v.optional(v.boolean())
});

export const FileField = v.object({
	...FieldBase.entries,
	type: v.literal('file')
});

export const BooleanField = v.object({
	...FieldBase.entries,
	type: v.literal('boolean')
});

const ObjectFieldType = v.literal('object');
export type ObjectField = v.InferInput<typeof FieldBase> & {
	type: v.InferInput<typeof ObjectFieldType>;
	fields: v.InferInput<typeof FormInputField>[];
};

export const ObjectField: v.GenericSchema<ObjectField> = v.object({
	...FieldBase.entries,
	type: ObjectFieldType,
	fields: v.array(
		v.lazy(() => {
			return FormInputField;
		})
	)
});

export const FormInputField = v.union([
	NumberField,
	StringField,
	ImageField,
	UuidField,
	FileField,
	BooleanField,
	DateField,
	ObjectField,
	ArrayField,
	EnumField
]);

/** @Deprecated renamed to FormInputField */
export const MetaInputField = FormInputField;

export const GlobLoader = v.object({
	type: v.literal('glob'),
	pattern: v.string(),
	base: v.optional(v.string())
});

export const FileLoader = v.object({
	type: v.literal('file'),
	path: v.string()
});

export const Loader = v.variant('type', [GlobLoader, FileLoader]);

export const SchemaDefinition = v.union([ObjectField, ArrayField]);

export const Collection = v.object({
	name: v.string(),
	displayName: v.string(),
	loader: Loader,
	formats: v.optional(v.array(v.string())),
	definition: SchemaDefinition
});

export type Loader = v.InferOutput<typeof Loader>;
export type GlobLoader = v.InferOutput<typeof GlobLoader>;
export type FileLoader = v.InferOutput<typeof FileLoader>;
export type Collection = v.InferOutput<typeof Collection>;
export type SchemaDefinition = v.InferOutput<typeof SchemaDefinition>;
export type GitCollection = v.InferInput<typeof Collection>;
export type FormInputField = v.InferInput<typeof FormInputField>;
export type MetaInputField = v.InferInput<typeof MetaInputField>;
export type StringField = v.InferInput<typeof StringField>;
export type NumberField = v.InferInput<typeof NumberField>;
export type ImageField = v.InferInput<typeof ImageField>;
export type UuidField = v.InferInput<typeof UuidField>;
export type FileField = v.InferInput<typeof FileField>;
export type BooleanField = v.InferInput<typeof BooleanField>;
export type EnumField = v.InferInput<typeof EnumField>;
export type DateField = v.InferInput<typeof DateField>;
