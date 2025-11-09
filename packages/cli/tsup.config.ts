import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["bin.ts"],
    splitting: true,
    sourcemap: false,
    dts: false,
    clean: true,
    format: ["esm"],
  },
]);
