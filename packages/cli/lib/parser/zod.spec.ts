import { describe, expect, test } from "vitest";
import {
  parseZodSchema,
  parseString,
  parseOptional,
  parseObject,
  parseNumber,
  parseArray,
  parseDefault,
} from "./zod.js";
import { z } from "zod";
import * as v from "valibot";
import * as cms from "@embodi/cms";

describe("parseZodSchema", () => {
  test("parseString - validate against schema", () => {
    const schema = z.string();
    const result = parseString(schema, "test");
    expect(() => v.parse(cms.StringField, result)).not.Throw();
  });

  test("parseString (complex)", () => {
    const schema = z.string().email().min(3).max(100);

    schema._zod.def;
    const result = parseString(schema, "email");
    const parsed = v.safeParse(cms.StringField, result);
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: "email",
      type: "string",
      pattern: "email",
      minLength: 3,
      maxLength: 100,
      optional: false,
    });
  });

  test("parse uuid string", () => {
    const schema = z.string().uuid().meta({ hidden: true, generate: true });
    const result = parseString(schema);
    const parsed = v.safeParse(cms.StringField, result);
    expect(parsed.output).toEqual({
      type: "string",
      pattern: "uuid",
      hidden: true,
      generate: true,
      optional: false,
    });
  });

  test("parseOptional", () => {
    const schema = z.optional(z.string());
    const result = parseOptional(schema, "optional");
    const parsed = v.safeParse(cms.StringField, result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: "optional",
      type: "string",
      optional: true,
    });
  });

  test("parseDefault", () => {
    const schema = z.string().default("default");
    const result = parseDefault(schema, "default");
    const parsed = v.safeParse(cms.StringField, result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: "default",
      type: "string",
      optional: false,
      default: "default",
    });
  });

  test("parseNumber", () => {
    const schema = z.number().min(0).max(100);
    const result = parseNumber(schema, "number");
    const parsed = v.safeParse(cms.NumberField, result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: "number",
      type: "number",
      optional: false,
      min: 0,
      max: 100,
    });
  });

  test("parseObject", () => {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(2).max(100),
    });
    const result = parseObject(schema, "user");
    const parsed = v.safeParse(cms.ObjectField, result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: "user",
      type: "object",
      optional: false,
      fields: [
        {
          fieldName: "email",
          type: "string",
          pattern: "email",
          optional: false,
        },
        {
          fieldName: "name",
          type: "string",
          minLength: 2,
          maxLength: 100,
          optional: false,
        },
      ],
    });
  });

  test("parseArray", () => {
    const schema = z.array(z.string().min(2).max(100));
    const result = parseArray(schema, "items");
    const parsed = v.safeParse(cms.ArrayField, result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: "items",
      type: "array",
      optional: false,
      items: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        optional: false,
      },
    });
  });

  test("type image", () => {
    const schema = z.string().meta({ type: "image" });
    const result = parseString(schema, "image");
    expect(result).toEqual({
      fieldName: "image",
      type: "image",
    });
  });

  test("full full type", () => {
    const schema = z.object({
      num: z.number().min(0).max(100),
      str: z.string().min(2).max(100),
      strWithDefault: z.string().min(2).max(100).default("some default value"),
      optional: z.string().min(2).max(100).optional(),
      optionalObj: z
        .object({
          name: z.string().min(2).max(100),
        })
        .optional(),
      optionalArray: z.array(z.string().min(2).max(100)).optional(),
      bool: z.boolean(),
      arr: z.array(z.string().min(2).max(100)),
      arrObj: z.array(
        z.object({
          name: z.string().min(2).max(100),
        }),
      ),
      image: z.string().meta({
        type: "image",
      }),
      obj: z.object({
        name: z.string().min(2).max(100),
        objNest: z.object({
          email: z.string().email(),
          name: z.string().min(2).max(100),
        }),
      }),
      enum: z.enum(["user", "admin"]),
      date: z.date(),
    });

    const result = parseZodSchema(schema);
    const parsed = v.safeParse(cms.SchemaDefinition, result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.output).toEqual({
      type: "object",
      optional: false,
      fields: [
        {
          fieldName: "num",
          type: "number",
          min: 0,
          max: 100,
          optional: false,
        },
        {
          fieldName: "str",
          type: "string",
          minLength: 2,
          maxLength: 100,
          optional: false,
        },
        {
          fieldName: "strWithDefault",
          type: "string",
          minLength: 2,
          maxLength: 100,
          optional: false,
          default: "some default value",
        },
        {
          fieldName: "optional",
          type: "string",
          minLength: 2,
          maxLength: 100,
          optional: true,
        },
        {
          fieldName: "optionalObj",
          type: "object",
          fields: [
            {
              fieldName: "name",
              type: "string",
              minLength: 2,
              maxLength: 100,
              optional: false,
            },
          ],
          optional: true,
        },
        {
          fieldName: "optionalArray",
          type: "array",
          optional: true,
          items: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            optional: false,
          },
        },
        {
          fieldName: "bool",
          type: "boolean",
          optional: false,
        },
        {
          fieldName: "arr",
          type: "array",
          items: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            optional: false,
          },
          optional: false,
        },
        {
          fieldName: "arrObj",
          type: "array",
          items: {
            type: "object",
            fields: [
              {
                fieldName: "name",
                type: "string",
                minLength: 2,
                maxLength: 100,
                optional: false,
              },
            ],
            optional: false,
          },
          optional: false,
        },
        {
          fieldName: "image",
          type: "image",
          optional: false,
        },
        {
          fieldName: "obj",
          type: "object",
          optional: false,
          fields: [
            {
              fieldName: "name",
              type: "string",
              minLength: 2,
              maxLength: 100,
              optional: false,
            },
            {
              fieldName: "objNest",
              type: "object",
              optional: false,
              fields: [
                {
                  fieldName: "email",
                  type: "string",
                  pattern: "email",
                  optional: false,
                },
                {
                  fieldName: "name",
                  type: "string",
                  minLength: 2,
                  maxLength: 100,
                  optional: false,
                },
              ],
            },
          ],
        },
        {
          fieldName: "enum",
          type: "enum",
          options: {
            user: "user",
            admin: "admin",
          },
          optional: false,
        },
        {
          fieldName: "date",
          type: "date",
          optional: false,
        },
      ],
    });
  });
});
