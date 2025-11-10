import { Command } from "commander";
import { readConfigFile, writeConfigFile } from "./helper";
import { createConfigFromAstro } from "../../lib/env/astro/compute";
import { resolve } from "node:path";
import { hasConfigChanged } from "../../lib/helper";
import { intro, outro, confirm, text } from "@clack/prompts";

export const init = new Command("init")
  .description("init the configuration file")
  .option("-C, --cwd <path>", "path to working directory", process.cwd())
  .action(async (options) => {
    await runInit(options.cwd);
  });

export const update = new Command("update")
  .description("Update the configuration file")
  .option("-C, --cwd <path>", "path to working directory", process.cwd())
  .action(async (options) => {
    await runUpdate(resolve(process.cwd(), options.cwd));
  });

export const runInit = async (cwd: string = process.cwd()) => {
  intro("Initializing configuration file");
  const config = await createConfigFromAstro(cwd);
  writeConfigFile(config, cwd);
  outro(
    "Configuration file initialized successfully. Please commit .embodi/cms/config.json the changes to make it available to your embodi cms",
  );
};

export const runUpdate = async (cwd: string = process.cwd()) => {
  intro("Searching for configuration file");
  const currentConfig = readConfigFile(cwd);
  if (!currentConfig) {
    const shouldInit = await confirm({
      message:
        "We couldn't find a configuration file in the current directory. Should we initialize one?",
    });
    if (shouldInit) {
      await runInit(cwd);
    }
    return;
  }
  text({ message: "Updating configuration file" });
  const { updatedAt, ...config } = await createConfigFromAstro(cwd);
  if (!hasConfigChanged(currentConfig, config)) {
    writeConfigFile(config, cwd);
    outro("Configuration file updated successfully");
  } else {
    outro("No changes detected");
  }
};
