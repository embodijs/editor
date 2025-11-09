import type * as loaders from "astro/loaders";
import type * as cms from "@embodi/cms";
import { join } from "node:path";

export const extractFormats = (pattern: string): string[] => {
  // Extract  from patter
  const braceMatch = pattern.match(/\{([^}]+)\}/);

  if (braceMatch && braceMatch[1]) {
    //  "md,mdx" → ["md", "mdx"]
    return braceMatch[1].split(",").map((ext) => ext.trim());
  }

  // Fallback: *.md
  const extMatch = pattern.match(/\.(\w+)$/);
  return extMatch && extMatch[1] ? [extMatch[1]] : [];
};

export const isFileLoader = (loader: cms.Loader): loader is cms.FileLoader => {
  return loader.type === "file";
};

export const legacyLoader = (
  key: string,
  type: "data" | "content" | undefined,
): cms.Loader => {
  if (type === "data") {
    return {
      type: "glob",
      base: `src/content/${key}`,
      pattern: "**/*.{json,yaml,yml}",
    };
  } else {
    return {
      type: "glob",
      base: `src/content/${key}`,
      pattern: "**/*.{md,mdx}",
    };
  }
};

export const parseLoader = (
  loader:
    | Parameters<typeof loaders.glob>[0]
    | Parameters<typeof loaders.file>[0],
): cms.Loader | undefined => {
  if (typeof loader === "string") {
    return {
      type: "file",
      path: loader,
    };
  } else {
    return {
      type: "glob",
      base: loader.base instanceof URL ? loader.base.href : loader.base,
      pattern: Array.isArray(loader.pattern)
        ? join(...loader.pattern)
        : loader.pattern,
    };
  }
};
