import fs from "node:fs";
import { resolve, dirname } from "node:path";
import * as cms from "@embodi/cms";

export const writeConfigFile = (
  config: cms.GitProjectConfig,
  cwd: string = process.cwd(),
) => {
  const path = resolve(cwd, ".embodi/cms/config.json");
  fs.mkdirSync(dirname(path), { recursive: true });
  fs.writeFileSync(path, JSON.stringify(config));
};
