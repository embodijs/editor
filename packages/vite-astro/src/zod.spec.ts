import { describe, expect, test } from "vitest";
import { parseZodSchema, parseString, parseOptional } from "./zod.js"
import { z } from "zod";
import * as v from 'valibot';
import { collection } from '@embodi/cms'
import { optional } from "zod/v3";

describe('parseZodSchema', () => {
  test('parseString - validate against schema', () => {
    const schema = z.string();
    const result = parseString(schema, 'test');
    expect(() => v.parse(collection.StringField, result)).not.Throw()
  })

  test('parseString (complex)', () => {
    const schema = z.string().email().min(3).max(100);

    schema._zod.def
    const result = parseString(schema, 'email');
    const parsed = v.safeParse(collection.StringField, result)
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: 'email',
      type: 'string',
      pattern: 'email',
      minLength: 3,
      maxLength: 100,
      optional: false
    })
  })

  test('parseOptional', () => {
    const schema = z.optional(z.string());
    const result = parseOptional(schema, 'optional');
    const parsed = v.safeParse(collection.StringField, result)
    expect(parsed.success).toBeTruthy();
    expect(parsed.output).toEqual({
      fieldName: 'optional',
      type: 'string',
      optional: true
    })
  })
})
