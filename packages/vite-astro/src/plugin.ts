import { build, type Plugin, type Rollup } from "vite";
import vm from "node:vm";
import * as z from "zod";

export const mockImports = (): Plugin => ({
  name: "vite-embodi-mock-imports",
  resolveId(id, importer) {
    if (!importer) return;
    const split = importer.split("/");
    const name = split[split.length - 1];


    if (name?.includes("content.config.")) {
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

export const virtualEntry = (): Plugin => ({
  name: "vite-embodi-virtual-entry",
  resolveId(id) {
    if (id === "embodi-config") {
      return "\0embodi-config";
    }
  },
  load(id) {
    if (id === "\0embodi-config") {
      return `import {collections} from './src/content.config.js';
        export { collections };
      `;
    }
  },
});

export default (): Plugin[] => {
  const imageHelper = z.string().meta({ id: "image_field" });

  return [
    {
      name: "vite-embodi-astro-ast-analyses",
      async buildEnd() {
        console.info("Starting cms config generation");

        const { output } = (await build({
          plugins: [virtualEntry(), mockImports()],
          configFile: false,
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
                glob: (i) => i,
                file: (i) => i,
              };
            } else if (id === "zod") {
              return z;
            }
          },
          exports: {},
          module: { exports: {} },
          console: console,
        };

        const result = await vm.runInNewContext(code, sandbox);
        const collections = Object.fromEntries(
          Object.entries(result).map(([key, value]) => {
            const { schema } = value;
            if (typeof schema === "function") {
              const result = schema({
                image: () => imageHelper,
              });
              return [
                key,
                {
                  ...value,
                  schema: result,
                },
              ];
            }
            return [key, value];
          }),
        );
        console.log(
          collections.blogs.schema._def.shape.image._def.innerType._def.shape.url.meta(),
        );
        console.log(JSON.stringify(collections.blogs.schema, null, 2));
        // console.log(JSON.stringify(collections, null, 2));
        console.info("Finished cms config generation");
      },
    },
  ];
};
