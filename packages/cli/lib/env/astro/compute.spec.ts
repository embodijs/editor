import { describe, expect, test } from "vitest";
import { createConfigFromAstro } from "./compute";
import { resolve } from "node:path";

describe("astro compute modules", () => {
  test("createConfigFromAstro (lagacy)", async () => {
    const path = resolve(process.cwd(), "test/files");
    const { collections } = await createConfigFromAstro(path);

    expect(collections).toEqual([
      {
        name: "cover_art",
        displayName: "Cover_art",
        loader: {
          type: "glob",
          base: "src/content/cover_art",
          pattern: "**/*.{json,yaml,yml}",
        },
        formats: ["json", "yaml", "yml"],
        definition: {
          type: "object",
          fields: [
            {
              fieldName: "title",
              type: "string",
            },
            {
              fieldName: "alt",
              type: "string",
            },
            {
              fieldName: "description",
              type: "string",
              optional: true,
            },
            {
              fieldName: "tags",
              type: "array",
              items: { type: "string" },
              optional: true,
            },
            {
              fieldName: "date",
              type: "date",
              optional: true,
            },
          ],
        },
      },
      {
        name: "blog",
        displayName: "Blog",
        loader: {
          type: "glob",
          base: "src/content/blog",
          pattern: "**/*.{md,mdx}",
        },
        formats: ["md", "mdx"],
        definition: {
          type: "object",
          fields: [
            {
              fieldName: "title",
              type: "string",
            },
            {
              fieldName: "description",
              type: "string",
            },
            {
              fieldName: "pubDate",
              type: "date",
            },
            {
              fieldName: "image",
              type: "string",
              optional: true,
            },
            {
              fieldName: "draft",
              type: "boolean",
              default: false,
            },
          ],
        },
      },
    ]);
  });
});
