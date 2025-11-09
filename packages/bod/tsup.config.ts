import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["bin.ts"],
    splitting: false,
    sourcemap: false,
    dts: false,
    clean: true,
    format: ["esm"],
  },
]);
