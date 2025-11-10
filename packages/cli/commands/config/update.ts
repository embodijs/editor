import { Command } from "commander";
import { readConfigFile, writeConfigFile } from "./helper";
import { createConfigFromAstro } from "../../lib/env/astro/compute";
import { resolve } from "node:path";
import { hasConfigChanged } from "../../lib/helper";

export const init = new Command("init")
  .description("init the configuration file")
  .option("-C, --cwd <path>", "path to working directory", process.cwd())
  .action(async (options) => {
    await runUpdate(options.cwd);
  });

export const update = new Command("update")
  .description("Update the configuration file")
  .option("-C, --cwd <path>", "path to working directory", process.cwd())
  .action(async (options) => {
    await runUpdate(resolve(process.cwd(), options.cwd));
  });

export const runInit = async (cwd: string = process.cwd()) => {
  const config = await createConfigFromAstro(cwd);
  writeConfigFile(config, cwd);
  console.info("***************************");
  console.info("");
  console.info(
    "Please commit .embodi/cms/config.json the changes to make it available to your embodi cms",
  );
  console.info("");
  console.info("***************************");
};

export const runUpdate = async (cwd: string = process.cwd()) => {
  const currentConfig = readConfigFile(cwd);
  if (!currentConfig) {
    console.log("We could find a configuration file in the current directory.");
    return;
  }
  //TODO compare the files exclude updatedAt
  const { updatedAt, ...config } = await createConfigFromAstro(cwd);
  if (!hasConfigChanged(currentConfig, config)) {
    writeConfigFile(config, cwd);
    console.info("Config updated successfully");
    console.info("***************************");
    console.info("");
    console.info(
      "Please commit the changes to make it available to your embodi cms",
    );
    console.info("");
    console.info("***************************");
  } else {
    console.info("No changes detected");
  }
};
