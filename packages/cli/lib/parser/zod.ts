import { z } from "zod";
import type * as collection from "@embodi/cms";

function getTypeDef<T extends z.core.$ZodType>(schema: T): T["_zod"]["def"] {
  // Zod 4 structure
  if ("_zod" in schema && schema._zod?.def) {
    return schema._zod.def;
  }
  // Zod 3 structure (fallback)
  if ("_def" in schema) {
    return (schema as any)._def;
  }
  throw new Error("Unsupported Zod version");
}

type TypeTransformer<
  O extends collection.MetaInputField = collection.MetaInputField,
> = (schema: z.core.$ZodType, fieldName?: string) => O | null;

const prepareTransformers = (
  list: TypeTransformer[],
  schema: z.core.$ZodType,
  fieldName?: string,
): ReturnType<TypeTransformer> => {
  for (const transformer of list) {
    const result = transformer(schema, fieldName);
    if (result) return result;
  }
  return null;
};

const runTypeTransformer = (schema: z.core.$ZodType, fieldName?: string) =>
  prepareTransformers(
    [
      // parseImage, // need to be called before string
      parseString,
      parseNumber,
      parseOptional,
      parseDefault,
      parseObject,
      parseArray,
      parseBoolean,
      parseDate,
      parseEnum,
    ], //order matters
    schema,
    fieldName,
  );

export const parseZodSchema = (
  schema: z.ZodObject | z.ZodArray,
): collection.ObjectField | collection.ArrayField => {
  const fieldsDefinition = runTypeTransformer(schema);
  if (
    !fieldsDefinition ||
    (fieldsDefinition.type !== "object" && fieldsDefinition.type !== "array")
  ) {
    throw new Error(`Failed to evaluate the ZOD Schema.`);
  }

  return fieldsDefinition;
};

const validateType = (type: string) => {
  if (!type) return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (type === "date") return "date";
  if (type === "array") return "array";
  if (type === "object") return "object";
  if (type === "enum") return "enum";
  if (type === "string") return "string";
  if (type === "image") return "image";
  console.warn(`Unknown type ${type}, defaulting to string`);
  return "string";
};

const extractMeta = (_schema: z.core.$ZodType) => {
  const schema = _schema as z.ZodType;

  if (typeof schema.meta === "function") {
    return schema.meta();
  }

  const { description } = schema;
  if (!description) return undefined;
  try {
    return JSON.parse(description);
  } catch (error) {
    console.error(`Failed to parse description: ${error}`);
    return undefined;
  }
};

const handleMeta = (schema: z.core.$ZodType) => {
  const meta = extractMeta(schema);
  if (!meta) return {};

  return Object.entries(meta).reduce((res, [attr, value]) => {
    if (attr === "hidden") res.hidden = !!value;
    else if (attr === "generate") res.generate = !!value;
    else if (attr === "label") res.displayName = String(value);
    else if (attr === "description") res.description = String(value);
    else if (attr === "type") res.type = validateType(String(value));
    return res;
  }, {} as collection.FormInputField);
};

const handleChecks = (def: z.core.$ZodTypeDef) => {
  const checks: [string, number | string][] | undefined = def.checks
    ?.map((check): [string, number | string] | null => {
      const { def } = check._zod;
      if (def.check === "string_format") {
        const { format } = def as z.core.$ZodCheckStringFormatDef;
        return ["pattern", format];
      } else if (def.check === "min_length") {
        return ["minLength", (def as z.core.$ZodCheckMinLengthDef).minimum];
      } else if (def.check === "max_length") {
        return ["maxLength", (def as z.core.$ZodCheckMaxLengthDef).maximum];
      } else if (def.check === "greater_than") {
        return ["min", Number((def as z.core.$ZodCheckGreaterThanDef).value)];
      } else if (def.check === "less_than") {
        return ["max", Number((def as z.core.$ZodCheckLessThanDef).value)];
      }
      return null;
    })
    .filter((value) => value != null);
  return checks ? Object.fromEntries(checks) : {};
};

export const parseString: TypeTransformer<collection.StringField> = (
  schema,
  fieldName,
) => {
  const def = getTypeDef(schema);
  if (def.type !== "string") {
    return null;
  }

  return {
    ...(fieldName ? { fieldName } : {}),
    type: "string",
    ...handleChecks(def),
    ...handleMeta(schema),
  };
};

export const parseNumber: TypeTransformer<collection.NumberField> = (
  schema,
  fieldName,
) => {
  const def = getTypeDef(schema);
  if (def.type !== "number") {
    return null;
  }
  return {
    ...(fieldName ? { fieldName } : {}),
    type: "number",
    ...handleChecks(def),
  };
};

const parseBoolean: TypeTransformer<collection.BooleanField> = (
  schema,
  fieldName,
) => {
  const def = getTypeDef(schema);
  if (def.type !== "boolean") {
    return null;
  }
  return {
    ...(fieldName ? { fieldName } : {}),
    type: "boolean",
  };
};

export const parseImage: TypeTransformer<collection.ImageField> = (
  schema,
  fieldName,
) => {
  const def = getTypeDef(schema);
  const meta = (schema as z.ZodString).meta();
  if (def.type !== "string" || meta?.type !== "image") {
    return null;
  }
  return {
    ...(fieldName ? { fieldName } : {}),
    type: "image",
    ...handleChecks(def),
  };
};

export const parseArray: TypeTransformer = (schema, fieldName) => {
  const def = getTypeDef(schema) as z.core.$ZodArrayDef;
  if (def.type !== "array") {
    return null;
  }
  const sub = runTypeTransformer(def.element);
  if (!sub) {
    return null;
  }
  return {
    ...(fieldName ? { fieldName } : {}),
    type: "array",
    items: sub,
  };
};

export const parseDate: TypeTransformer = (schema, fieldName) => {
  const def = getTypeDef(schema);
  if (def.type !== "date") {
    return null;
  }
  return {
    ...(fieldName ? { fieldName } : {}),
    type: "date",
    ...handleChecks(def),
    ...handleMeta(schema),
  };
};

export const parseEnum: TypeTransformer<collection.EnumField> = (
  schema,
  fieldName,
) => {
  const def = getTypeDef(schema);
  if (def.type !== "enum") {
    return null;
  }
  const { entries } = def as z.core.$ZodEnumDef;
  return {
    ...(fieldName ? { fieldName } : {}),
    type: "enum",
    options: entries,
    ...handleChecks(def),
  };
};

export const parseOptional: TypeTransformer = (schema, fieldName) => {
  const def = getTypeDef(schema) as z.core.$ZodOptionalDef;
  if (def.type === "optional") {
    const sub = runTypeTransformer(def.innerType, fieldName);
    if (!sub) {
      return null;
    }
    return {
      ...sub,
      optional: true,
    };
  }
  return null;
};

export const parseDefault: TypeTransformer = (schema, fieldName) => {
  const def = getTypeDef(schema) as z.core.$ZodDefaultDef;
  if (def.type === "default") {
    const sub = runTypeTransformer(def.innerType, fieldName);
    if (!sub) {
      return null;
    }
    return {
      ...sub,
      default: def.defaultValue,
    };
  }
  return null;
};

export const parseObject: TypeTransformer = (schema, fieldName) => {
  const def = getTypeDef(schema);

  if (def.type !== "object") {
    return null;
  }
  const { shape } = def as z.core.$ZodObjectDef;
  return {
    ...(fieldName ? { fieldName } : {}),
    type: "object",
    fields: Object.entries(shape)
      .map(([key, value]) => runTypeTransformer(value, key))
      .filter((v) => v !== null),
  };
};
