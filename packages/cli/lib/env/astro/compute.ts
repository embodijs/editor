import { build, type Plugin, type Rollup } from "vite";
import type * as loaders from "astro/loaders";
import vm from "node:vm";
import { z } from "zod";
import * as cms from "@embodi/cms";
import { parseZodSchema } from "../../parser/zod.js";
import { extractSchema } from "./schema.js";
import { contentPlugin } from "@embodi/vite-astro-cms";
import {
  extractFormats,
  isFileLoader,
  legacyLoader,
  parseLoader,
} from "./loaders";
import { camelToReadable, hasFile, resolveRelativePath } from "../../helper.js";
import { resolve, dirname } from "node:path";

export const mockImports = (): Plugin => ({
  name: "vite-embodi-mock-imports",
  resolveId(id) {
    if (id === "astro:content") {
      return `\0${id}`;
    }
    return null;
  },
  load(id) {
    if (id === "\0astro:content") {
      return `
        export * as z from 'zod';
        export const defineCollection = (i) => i;
      `;
    }
    return null;
  },
});

export const virtualEntry = (): Plugin => {
  let root = process.cwd();
  return {
    name: "vite-embodi-virtual-entry",
    configResolved(resolvedConfig) {
      root = resolvedConfig.root;
    },
    resolveId(id) {
      if (id === "embodi-config") {
        return "\0embodi-config";
      }
      return null;
    },
    load(id) {
      if (id === "\0embodi-config") {
        if (hasFile(resolve(root, "src"), "content.config.*")) {
          const configPath = resolve(root, "src/content.config.js");
          return `
        export { collections } from '${configPath}';
        export const legacy = false;
      `;
        } else if (hasFile(resolve(root, "src/content"), "config.*")) {
          const configPath = resolve(root, "src/content/config.js");
          return `
        export { collections } from '${configPath}';
        export const legacy = true;
      `;
        }

        throw new Error("No content config found");
      }
      return null;
    },
  };
};

export const createConfigFromAstro = async (root = process.cwd()) => {
  const { output } = (await build({
    plugins: [contentPlugin(), virtualEntry(), mockImports()],
    configFile: false,
    root,
    logLevel: "silent",
    build: {
      write: false,
      ssr: true,
      rollupOptions: {
        output: {
          format: "cjs",
        },
        input: "embodi-config",
        external: ["astro/loaders", "zod"],
      },
    },
  })) as Rollup.RollupOutput;

  const { imports, importedBindings, code } = output[0];
  const sandbox = {
    require: (id: string) => {
      if (id === "astro/loaders") {
        return {
          glob: (i: Parameters<typeof loaders.glob>[0]) => i,
          file: (i: Parameters<typeof loaders.file>[0]) => i,
        };
      } else if (id === "zod") {
        return z;
      }
    },
    exports: { collections: {}, definitions: {}, legacy: false },
    module: { exports: {} },
    console: console,
  };
  type AstroCollection = {
    type?: "data" | "content";
    label?: string;
    description?: string;
    assets?: string;
    loader:
      | Parameters<typeof loaders.glob>[0]
      | Parameters<typeof loaders.file>[0];
    schema: z.ZodObject<any> | ((...args: any[]) => z.ZodObject<any>);
  };

  await vm.runInNewContext(code, sandbox);
  const collectionsRaw: Record<string, AstroCollection> =
    sandbox.exports.collections;
  const isLegacy = sandbox.exports.legacy as boolean;
  const collections: cms.Collection[] = Object.entries(collectionsRaw)
    .map(([key, value]) => {
      const schema = extractSchema(value.schema);

      const loader = isLegacy
        ? legacyLoader(key, value.type)
        : parseLoader(value.loader);
      if (!loader) {
        return null;
      }
      const collectionRoot = isFileLoader(loader)
        ? dirname(loader.path)
        : loader.base;

      const formats =
        "pattern" in loader ? extractFormats(loader.pattern) : undefined;
      const fields = isFileLoader(loader)
        ? parseZodSchema(
            z.array(
              z.object({
                id: z.string().uuid().meta({ hidden: true, generate: true }),
                ...schema.shape,
              }),
            ),
          )
        : parseZodSchema(schema);

      return {
        name: key,
        displayName: value.label ?? camelToReadable(key),
        description: value.description,
        assets: value.assets
          ? resolveRelativePath(collectionRoot ?? "", value.assets)
          : undefined,
        loader: loader,
        formats,
        definition: fields,
      };
    })
    .filter((entry) => entry != null);

  const assets = collections
    .map((collection) => collection.assets)
    .reduce(
      (acc, curr) => (curr && !acc.includes(curr) ? [...acc, curr] : acc),
      [] as string[],
    );

  const config: cms.GitProjectConfig = {
    collections,
    assets,
    updatedAt: new Date().getTime(),
    v: "1.0",
  };

  return config;
};
