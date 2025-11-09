import { Command } from "commander";
import { writeConfigFile } from "./helper";
import { createConfigFromAstro } from "../../lib/env/astro/compute";

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
    await runUpdate(options.cwd);
  });

export const runUpdate = async (cwd: string = process.cwd()) => {
  const config = await createConfigFromAstro(cwd);
  writeConfigFile(config, cwd);
};
