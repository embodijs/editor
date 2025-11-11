import { z } from "zod";

export const imageTypeMock = z
  .string()
  .describe(JSON.stringify({ type: "image" }));

function isZodSchema(value: unknown): value is z.ZodType {
  return value instanceof z.ZodType;
}

export const extractSchema = (
  schema: z.ZodType | ((...args: unknown[]) => z.ZodType),
) => {
  if (isZodSchema(schema)) {
    return schema;
  }
  return schema({
    image: () => imageTypeMock,
  });
};
