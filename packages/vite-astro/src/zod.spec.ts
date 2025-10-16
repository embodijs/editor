import { describe, expect, test } from "vitest";
import {
  parseZodSchema,
  parseString,
  parseOptional,
  parseObject,
  parseNumber,
  parseArray,
  imageTypeMock,
  parseImage,
} from "./zod.js";
import { z } from "zod";
import * as v from "valibot";
import * as collection from "@embodi/cms";

describe("parseZodSchema", () => {
  test("parseString - validate against schema", () => {
    const schema = z.string();
    const result = parseString(schema, "test");
    expect(() => v.parse(collection.StringField, result)).not.Throw();
  });

  test("parseString (complex)", () => {
    const schema = z.string().email().min(3).max(100);

    schema._zod.def;
    const result = parseString(schema, "email");
    const parsed = v.safeParse(collection.StringField, result);
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

  test("parseOptional", () => {
    const schema = z.optional(z.string());
    const result = parseOptional(schema, "optional");
    const parsed = v.safeParse(collection.StringField, result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: "optional",
      type: "string",
      optional: true,
    });
  });

  test("parseNumber", () => {
    const schema = z.number().min(0).max(100);
    const result = parseNumber(schema, "number");
    const parsed = v.safeParse(collection.NumberField, result);
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
    const parsed = v.safeParse(collection.ObjectField, result);
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
    const parsed = v.safeParse(collection.ArrayField, result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: "items",
      type: "array",
      optional: false,
      items: {
        fieldName: "items",
        type: "string",
        minLength: 2,
        maxLength: 100,
        optional: false,
      },
    });
  });

  test("image mock fits parser", () => {
    const schema = imageTypeMock;
    const result = parseImage(schema, "image");
    expect(result).toEqual({
      fieldName: "image",
      type: "image",
    });
  });

  test("full full type", () => {
    const schema = z.object({
      num: z.number().min(0).max(100),
      str: z.string().min(2).max(100),
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
    const parsed = v.safeParse(v.array(collection.MetaInputField), result);
    expect(parsed.issues).toBeUndefined();
    expect(parsed.output).toEqual([
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
          fieldName: "items",
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
          fieldName: "items",
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
          fieldName: "items",
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
    ]);
  });
});
