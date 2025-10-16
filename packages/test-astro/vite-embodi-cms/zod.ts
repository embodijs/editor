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

const getZodDef = (schema: z.Schema): any => {
  return (schema as any)._zod?.def ?? (schema as any)._def;
};

type Transformer = (schema: z.Schema) => MetaInputField | null;

const prepareTransformers = (list: Transformer[]) => (schema: z.Schema): MetaInputField => {
  for (const transformer of list) {
    const result = transformer(schema);
    if (result) return result;
  }
};

const parseString: Transformer = (schema) => {
  const def = getZodDef(schema);
  if(def.type === "string") {
    return {
      name: def.name,
      type: "string",
    };
  }
  return null;
}

const parseNumber: Transformer = (schema) => {
  const def = getZodDef(schema);
  if(def.type === "number") {
    return {
      name: def.name,
      type: "number",
    };
  }
  return null;
}

const parseObject: Transformer = (schema) => {
  const def = getZodDef(schema);
  if(def.type === "object") {
    return {
      name: def.name,
      type: "object",
    };
  }
  return null;
}

const parseOptional: Transformer = (schema) => {
  const def = getZodDef(schema);
  if(def.type === "optional") {
    return {
      name: def.name,
      type: "optional",
    };
  }
  return null;
}

const parseNullable: Transformer = (schema) => {
  const def = getZodDef(schema);
  if(def.type === "nullable") {
    return {
      name: def.name,
      type: "nullable",
    };
  }
  return null;
}


export const parseZodSchema = (
  zodSchema: z.Schema,
  fieldName: string,
): MetaInputField => {

  [].

  const def = getZodDef(zodSchema);

  if (!def) {
    throw new Error(`No def found for field: ${fieldName}`);
  }

  // Extract meta for displayName
  const meta =
    typeof (zodSchema as any).meta === "function"
      ? (zodSchema as any).meta()
      : {};

  // Base field properties
  const baseField = {
    name,
  };

  // Handle optional/nullable wrappers
  if (def.type === "optional" || def.type === "nullable") {
    return {
      ...parseZodSchema(def.innerType, fieldName),
      optional: true,
    };
  }

  switch (def.type) {
    case "object":
      return parseObjectType(zodSchema);
    case "string": {
      const field: StringField = {
        ...baseField,
        type: "string",
      };

      // Extract validations from checks
      for (const check of def.checks ?? []) {
        switch (check.kind) {
          case "min":
            field.minLength = check.value;
            break;
          case "max":
            field.maxLength = check.value;
            break;
          case "email":
            field.pattern = "email";
            break;
          case "url":
            field.pattern = "url";
            break;
        }
      }

      // Check if this is actually an image field (via meta)
      if (meta.id === "image_field" || meta.type === "image") {
        return {
          ...baseField,
          type: "image",
        } as ImageField;
      }

      return field;
    }

    case "number": {
      const field: NumberField = {
        ...baseField,
        type: "number",
      };

      for (const check of def.checks ?? []) {
        switch (check.kind) {
          case "min":
            field.min = check.value;
            break;
          case "max":
            field.max = check.value;
            break;
        }
      }

      return field;
    }

    case "date": {
      const field: DateField = {
        ...baseField,
        type: "date",
      };

      // Zod date checks don't translate directly to ISO strings
      // You might need to handle this differently

      return field;
    }

    case "boolean": {
      return {
        ...baseField,
        type: "boolean",
      } as BooleanField;
    }

    case "array": {
      const elementDef = getZodDef(def.element);

      // Check if it's a string array (enum)
      if (elementDef?.type === "string") {
        return {
          ...baseField,
          type: "array", // EnumField uses 'array'!
          options: meta.options, // You'll need to pass options via meta
        } as EnumField;
      }

      // For other array types, you might need custom handling
      throw new Error(`Unsupported array element type for field: ${fieldName}`);
    }

    case "enum": {
      return {
        ...baseField,
        type: "array",
        options: def.values as string[],
      } as EnumField;
    }

    default:
      throw new Error(
        `Unsupported Zod type: ${def.type} for field: ${fieldName}`,
      );
  }
};

// Extract all fields from object schema
const parseObjectType = (zodSchema: z.ZodObject): MetaInputField[] => {
  const def = getZodDef(zodSchema);

  if (def.type !== "object") {
    throw new Error("Schema must be a ZodObject");
  }

  const shapeObj = typeof def.shape === "function" ? def.shape() : def.shape;
  const fields: MetaInputField[] = [];

  for (const [fieldName, fieldSchema] of Object.entries(shapeObj)) {
    fields.push(parseZodSchema(fieldSchema as z.ZodTypeAny, fieldName));
  }

  return fields;
};
