import { z } from "zod";
import type {
  MetaInputField,
  StringField,
  NumberField,
  DateField,
  BooleanField,
  ImageField,
  FileField,
  EnumField,
} from "@emdodi/cms";
import { optional } from "astro/zod";


function getTypeDef<T extends z.core.$ZodType>(schema: T) {
  return schema._zod.def;
};

type Transformer = (schema: z.core.$ZodType, fieldName: string) => MetaInputField | null;

const prepareTransformers = (list: Transformer[], schema: z.core.$ZodType, fieldName: string): MetaInputField => {
  for (const transformer of list) {
    const result = transformer(schema, fieldName);
    if (result) return result;
  }
};

const runTypeTranfromer = (schema: z.core.$ZodType, fieldName: string) => prepareTransformers([parseString, parseNumber], schema, fieldName)

export const parseString: Transformer = (schema, fieldName) => {
  const def = getTypeDef(schema) as z.core.$ZodStringDef;
  if(def.type !== "string") {
    return null;
  }
  const checks: [string, number | string][] | undefined =  def.checks?.map((check): [string, number | string] | null => {
    const {def} = check._zod
    if(def.check === 'string_format') {
      return ['pattern', (def as z.core.$ZodCheckStringFormatDef).format];
    } else if(def.check === 'min_length') {
      return ['minLength', (def as z.core.$ZodCheckMinLengthDef).minimum];
    } else if(def.check === 'max_length') {
      return ['maxLength', (def as z.core.$ZodCheckMaxLengthDef).maximum];
    }
    return null;
  }).filter((value) => value != null);
  return {
    fieldName,
    type: "string",
    ...(checks ? Object.fromEntries(checks) : {})
  };
}

const parseNumber: Transformer = (schema) => {
  const def = getTypeDef(schema);
  if(def.type === "number") {
    return {
      name: def.name,
      type: "number",
    };
  }
  return null;
}

const parseObject: Transformer = (schema) => {
  const def = getTypeDef(schema);
  if(def.type === "object") {
    return {
      name: def.name,
      type: "object",
    };
  }
  return null;
}

export const parseOptional: Transformer = (schema, fieldName) => {
  const def = getTypeDef(schema) as z.core.$ZodOptionalDef;
  if(def.type === "optional") {
    return {
      ...runTypeTranfromer(def.innerType, fieldName),
      optional: true,
    };
  }
  return null;
}

const parseNullable: Transformer = (schema) => {
  const def = getTypeDef(schema);
  if(def.type === "nullable") {
    return {
      name: def.name,
      type: "nullable",
    };
  }
  return null;
}
