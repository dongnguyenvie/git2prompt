#!/usr/bin/env node

import { Command } from "commander";
import { exportGitToPrompt } from "./index";

const program = new Command();

program
  .version("1.0.0")
  .description("Export a Git repository into an LLM-ready prompt.")
  .argument("<repoPath>", "Path to the Git repository")
  .option("-o, --output <path>", "Path to save the output file")
  .action(async (repoPath, options) => {
    try {
      const result = await exportGitToPrompt(repoPath, options.output);
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  });

program.parse(process.argv);
