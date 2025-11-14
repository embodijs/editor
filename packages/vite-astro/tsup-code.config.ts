import { defineConfig } from "tsup";
import RawPlugin from "esbuild-plugin-raw";

export default defineConfig([
  {
    entry: ["src/code/content.ts"],
    outDir: "code",
    splitting: false,
    sourcemap: false,
    dts: true,
    clean: true,
    format: ["esm"],
    external: ["astro:content"],
  },
]);
