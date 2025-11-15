import { minimatch } from "minimatch";
import fs from "node:fs";
import { join } from "node:path";
import * as cms from "@embodi/cms";

export const camelToReadable = (str: string) => {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Akronyme: "URLParser" → "URL Parser"
    .replace(/([a-z\d])([A-Z])/g, "$1 $2") // Normal: "myURL" → "my URL"
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim()
    .split(" ")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
};

export const hasFile = (path: string, match: string) => {
  const dir = fs.readdirSync(path, { withFileTypes: true });
  return dir.some((item) => item.isFile() && minimatch(item.name, match));
};

const removeTimeAttributes = (config: cms.GitProjectConfig) => {
  const { updatedAt, ...cleaned } = config;
  return cleaned;
};

export const hasConfigChanged = (
  config1: cms.GitProjectConfig,
  config2: cms.GitProjectConfig,
) => {
  const cleaned1 = removeTimeAttributes(config1);
  const cleaned2 = removeTimeAttributes(config2);

  return JSON.stringify(cleaned1) !== JSON.stringify(cleaned2);
};

export const resolveRelativePath = (base: string, path: string) => {
  if (path.startsWith("./") || path.startsWith("../")) {
    return join(base, path);
  } else {
    return path;
  }
};
