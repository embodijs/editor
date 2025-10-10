import type {
	MetaInputField,
	NumberField,
	TextField,
	DateField,
	SelectField,
	ImageField
} from '$core/model/collection';
import * as v from 'valibot';

const handleOptional = <T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	fields: MetaInputField,
	schema: T
) => (fields.optional ? v.optional(schema) : schema);

export const handleText = (field: TextField) => {
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

const handleNumber = (field: NumberField) => {
	const deepParams: v.BaseValidation<number, number, v.BaseIssue<unknown>>[] = [];
	if (field.min) {
		deepParams.push(v.minValue(field.min));
	} else if (field.max) {
		deepParams.push(v.maxValue(field.max));
	}
	return handleOptional(field, v.pipe(v.number(), ...deepParams));
};

const handleDate = (field: DateField) => {
	const pipe = v.pipe(
		v.date(),
		field.min ? v.minValue(new Date(field.min)) : v.check<Date>(() => true),
		field.max ? v.maxValue(new Date(field.max)) : v.check<Date>(() => true)
	);
	return handleOptional(field, pipe);
};

const handleArray = (field: SelectField) => {
	return handleOptional(field, v.array(v.string()));
};

const handleCheckbox = () => v.optional(v.boolean(), false);

const handleImage = (field: ImageField) => {
	return handleOptional(field, v.string());
};

export const convertMetaFiledsToValibotSchmea = (fields: MetaInputField[]) => {
	const formSchema = fields.reduce(
		(schema, field) => {
			if (field.type === 'string') {
				return { ...schema, [field.fieldName]: handleText(field) };
			}
			if (field.type === 'number') {
				return { ...schema, [field.fieldName]: handleNumber(field) };
			}
			if (field.type === 'boolean') {
				return { ...schema, [field.fieldName]: handleCheckbox() };
			}
			if (field.type === 'date') {
				return { ...schema, [field.fieldName]: handleDate(field) };
			}
			if (field.type === 'array') {
				return { ...schema, [field.fieldName]: handleArray(field) };
			}
			if (field.type === 'image') {
				return { ...schema, [field.fieldName]: handleImage(field) };
			}
			return schema;
		},
		{} as Record<string, v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>
	);
	return v.object(formSchema);
};
