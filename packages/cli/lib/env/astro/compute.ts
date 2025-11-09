import { build, type Plugin, type Rollup } from "vite";
import type * as loaders from "astro/loaders";
import vm from "node:vm";
import * as z from "zod";
import * as cms from "@embodi/cms";
import { extractSchema, parseZodSchema } from "../../parser/zod.js";
import {
  extractFormats,
  isFileLoader,
  legacyLoader,
  parseLoader,
} from "./loaders";
import { camelToReadable, hasFile } from "../../helper.js";
import { resolve } from "node:path";

export const mockImports = (): Plugin => ({
  name: "vite-embodi-mock-imports",
  resolveId(id, importer) {
    if (!importer) return;
    const split = importer.split("/");
    const folder = split[split.length - 2];
    const name = split[split.length - 1];

    if (
      name?.includes("content.config.") ||
      (name?.includes("config.") && folder === "content")
    ) {
      console.log("Loading mock import:", id, importer);

      return `\0virtual:${id}`;
    }
  },
  load(id) {
    if (id === "\0virtual:astro:content") {
      return `
        export * as z from 'zod';
        export const defineCollection = (i) => i;
      `;
    }
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
    },
  };
};

export const createConfigFromAstro = async (root = process.cwd()) => {
  console.log({ root });
  const { output } = (await build({
    plugins: [virtualEntry(), mockImports()],
    configFile: false,
    root,
    build: {
      write: false,
      ssr: true,
      rollupOptions: {
        output: {
          format: "cjs",
        },
        input: "embodi-config",
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
    exports: { collections: {}, legacy: false },
    module: { exports: {} },
    console: console,
  };
  type AstroCollection = {
    type?: "data" | "content";
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
        displayName: camelToReadable(key),
        loader: loader,
        formats,
        definition: fields,
      };
    })
    .filter((entry) => entry != null);

  const config: cms.GitProjectConfig = {
    collections,
    updatedAt: new Date().getTime(),
    v: "1.0",
  };

  return config;
};
