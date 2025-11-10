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

export const readConfigFile = (
  cwd: string = process.cwd(),
): cms.GitProjectConfig | null => {
  const path = resolve(cwd, ".embodi/cms/config.json");
  if (!fs.existsSync(path)) return null;
  const config = fs.readFileSync(path, "utf8");
  return JSON.parse(config) as cms.GitProjectConfig;
};
