#!/usr/bin/env node

import pkg from "./package.json" with { type: "json" };
import { program } from "commander";
import { update, init } from "./commands/config/index.ts";

// adds a gap of spacing between the executing command and the output
console.log();

program.name(pkg.name).version(pkg.version, "-v, --version");
program.addCommand(init).addCommand(update);
program.parse();
