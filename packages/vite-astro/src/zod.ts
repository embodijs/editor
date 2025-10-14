import { z } from "zod";
import type * as collection from "@embodi/cms";

function getTypeDef<T extends z.core.$ZodType>(schema: T): T["_zod"]["def"] {
  return schema._zod.def;
}

type TypeTransformer<
  O extends collection.MetaInputField = collection.MetaInputField,
> = (schema: z.core.$ZodType, fieldName: string) => O | null;

const prepareTransformers = (
  list: TypeTransformer[],
  schema: z.core.$ZodType,
  fieldName: string,
): ReturnType<TypeTransformer> => {
  for (const transformer of list) {
    const result = transformer(schema, fieldName);
    if (result) return result;
  }
  return null;
};

const runTypeTransformer = (schema: z.core.$ZodType, fieldName: string) =>
  prepareTransformers(
    [
      parseImage, // need to be called before string
      parseString,
      parseNumber,
      parseOptional,
      parseObject,
      parseArray,
      parseBoolean,
      parseDate,
      parseEnum,
    ], //order matters
    schema,
    fieldName,
  );

export const parseZodSchema = (schema: z.ZodObject) => {
  const def = getTypeDef(schema);
  if (def.type !== "object") {
    return null;
  }
  const { shape } = def;
  return Object.entries(shape)
    .map(([key, value]) => runTypeTransformer(value, key))
    .filter((v) => v != null);
};

const handleChecks = (def: z.core.$ZodTypeDef) => {
  const checks: [string, number | string][] | undefined = def.checks
    ?.map((check): [string, number | string] | null => {
      const { def } = check._zod;
      if (def.check === "string_format") {
        return ["pattern", (def as z.core.$ZodCheckStringFormatDef).format];
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
    fieldName,
    type: "string",
    ...handleChecks(def),
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
    fieldName,
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
    fieldName,
    type: "boolean",
  };
};

const parseImage: TypeTransformer<collection.ImageField> = (
  schema,
  fieldName,
) => {
  const def = getTypeDef(schema);
  const meta = (schema as z.ZodString).meta();
  if (def.type !== "string" || meta?.type !== "image") {
    return null;
  }
  return {
    fieldName,
    type: "image",
    ...handleChecks(def),
  };
};

export const parseArray: TypeTransformer = (schema, fieldName) => {
  const def = getTypeDef(schema) as z.core.$ZodArrayDef;
  if (def.type !== "array") {
    return null;
  }
  const sub = runTypeTransformer(def.element, "items");
  if (!sub) {
    return null;
  }
  return {
    fieldName,
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
    fieldName,
    type: "date",
    ...handleChecks(def),
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
  console.log({ entries });
  return {
    fieldName,
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

export const parseObject: TypeTransformer = (schema, fieldName) => {
  const def = getTypeDef(schema);
  if (def.type !== "object") {
    return null;
  }
  const { shape } = def as z.core.$ZodObjectDef;
  return {
    fieldName,
    type: "object",
    fields: Object.entries(shape)
      .map(([key, value]) => runTypeTransformer(value, key))
      .filter((v) => v !== null),
  };
};
