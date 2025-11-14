import { defineConfig } from "tsup";
import RawPlugin from "esbuild-plugin-raw";

export default defineConfig([
  {
    entry: ["src/plugin.ts"],
    outDir: "dist",
    splitting: false,
    sourcemap: true,
    dts: true,
    clean: true,
    format: ["esm", "cjs"],
    esbuildPlugins: [RawPlugin()],
    treeshake: true,
    external: ["astro:content", "astro"],
  },
]);
