import { type Plugin } from "vite";
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
//     {
//   name: "vite-embodi-astro-virtual-modules-types",
//   buildStart() {
//     const configPath = ".embodi/types/content.d.ts";
//     fs.mkdirSync(dirname(configPath), { recursive: true });
//     fs.writeFileSync(configPath, ``);
//   },
// },
export default (): Plugin => {
  return {
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
  };
};
