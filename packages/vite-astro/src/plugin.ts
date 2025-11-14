import { type Plugin } from "vite";
import fs from "fs";
import code from "../code/content.js?raw";

const virtual = {
  resolveIds: ["embodi:content"],

  isValid: (id: string) => {
    return virtual.resolveIds.includes(id);
  },

  resolve: (id: string) => {
    return `\0${id}`;
  },

  isLoadId: (id: string, cat: string) => {
    return virtual.resolveIds.some(
      (resId) => virtual.resolve(resId) === id && id.endsWith(cat),
    );
  },
};

export const contentPlugin = () =>
  ({
    name: "vite-embodi-astro-virtual-modules",
    resolveId(id: string) {
      if (virtual.isValid(id)) {
        return virtual.resolve(id);
      }
      return null;
    },
    load(id: string) {
      if (virtual.isLoadId(id, "content")) {
        return code;
      }
      return null;
    },
  }) satisfies Plugin;

export const updateTsConfigPlugin = () =>
  ({
    name: "vite-embodi-astro-virtual-modules-types",
    buildStart() {
      const tsConfigPath = "tsconfig.json";
      if (fs.existsSync(tsConfigPath)) {
        const strContent = fs.readFileSync(tsConfigPath, "utf-8");
        const config = JSON.parse(strContent);
        if (
          !config.compilerOptions?.types?.includes(
            "@embodi/vite-astro-cms/client",
          )
        ) {
          config.compilerOptions.types = [
            ...(config?.compilerOptions?.types ?? []),
            "@embodi/vite-astro-cms/client",
          ];
          fs.writeFileSync(tsConfigPath, JSON.stringify(config, null, 2));
        }
      }
    },
  }) satisfies Plugin;

export default () => {
  return [contentPlugin(), updateTsConfigPlugin()];
};
