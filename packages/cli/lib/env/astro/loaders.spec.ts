import { describe, expect, test } from "vitest";
import { extractFormats, parseLoader } from "./loaders";

describe("extractFormats", () => {
  test("extractFormats **/*.{astro,md,mdx}", () => {
    const formats = extractFormats("**/*.{astro,md,mdx}");
    expect(formats).toEqual(["astro", "md", "mdx"]);
  });

  test("extractFormats **/*.{md,mdx,html}", () => {
    const formats = extractFormats("**/*.{md, mdx, html}");
    expect(formats).toEqual(["md", "mdx", "html"]);
  });

  test("extractFormats **/*.html", () => {
    const formats = extractFormats("**/*.html");
    expect(formats).toEqual(["html"]);
  });
});

describe("parseLoader", () => {
  test("parse glob", () => {
    const loader = parseLoader({
      base: "/content/blog",
      pattern: "**/*.{html,md,mdx}",
    });
    expect(loader).toEqual({
      type: "glob",
      base: "/content/blog",
      pattern: "**/*.{html,md,mdx}",
    });
  });
  test("parse file", () => {
    const loader = parseLoader("some/file/src.json");
    expect(loader).toEqual({
      type: "file",
      path: "some/file/src.json",
    });
  });
});
