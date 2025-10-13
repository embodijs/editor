import * as v from 'valibot';

const FieldDisplayName = v.union([
	v.string(),
	v.record(v.pipe(v.string(), v.length(2)), v.string())
]);

const FieldBase = v.object({
	fieldName: v.string(),
	displayName: v.optional(FieldDisplayName),
	optional: v.optional(v.boolean(), false)
});

export const NumberField = v.object({
	...FieldBase.entries,
	type: v.literal('number'),
	min: v.optional(v.number()),
	max: v.optional(v.number())
});

export const DateField = v.object({
	...FieldBase.entries,
	type: v.literal('date'),
	min: v.optional(v.pipe(v.string(), v.isoDate())),
	max: v.optional(v.pipe(v.string(), v.isoDate()))
});

export const EnumField = v.object({
	...FieldBase.entries,
	type: v.literal('array'),
	options: v.optional(v.array(v.string()))
});

export const StringField = v.object({
	...FieldBase.entries,
	type: v.literal('string'),
	minLength: v.optional(v.number()),
	maxLength: v.optional(v.number()),
	pattern: v.optional(v.union([v.literal('email'), v.literal('url'), v.literal('slug')]))
});

export const ImageField = v.object({
	...FieldBase.entries,
	type: v.literal('image')
});

export const FileField = v.object({
	...FieldBase.entries,
	type: v.literal('file')
});

export const BooleanField = v.object({
	...FieldBase.entries,
	type: v.literal('boolean')
});

const MetaInputField = v.variant('type', [
	NumberField,
	StringField,
	ImageField,
	FileField,
	BooleanField,
	EnumField,
	DateField
]);

export const Loader = v.object({
	type: v.literal('glob'),
	pattern: v.string(),
	base: v.string()
});

export const Collection = v.object({
	name: v.string(),
	displayName: v.string(),
	loader: Loader,
	formats: v.array(v.string()),
	fields: v.array(MetaInputField)
});

export type Loader = v.InferOutput<typeof Loader>;
export type Collection = v.InferOutput<typeof Collection>;
export type MetaInputField = v.InferOutput<typeof MetaInputField>;
export type StringField = v.InferOutput<typeof StringField>;
export type NumberField = v.InferOutput<typeof NumberField>;
export type ImageField = v.InferOutput<typeof ImageField>;
export type FileField = v.InferOutput<typeof FileField>;
export type BoolenField = v.InferOutput<typeof BooleanField>;
export type EnumField = v.InferOutput<typeof EnumField>;
export type DateField = v.InferOutput<typeof DateField>;
