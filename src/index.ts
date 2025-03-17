import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import ignore from "ignore";
import { Command } from "commander";

/**
 * Exports a Git repository's tracked files into an LLM-ready prompt.
 * @param repoPath - The local path to the Git repository.
 * @param outputFilePath - (Optional) Path to save the output as a file.
 * @returns A formatted string containing repository details and file contents.
 */
export async function exportGitToPrompt(
  repoPath: string,
  outputFilePath?: string
): Promise<string> {
  try {
    if (!fs.existsSync(repoPath)) {
      throw new Error(`Repository not found: ${repoPath}`);
    }

    const git = simpleGit(repoPath);
    const gitFiles = (await git.raw(["ls-files"])).trim();

    if (!gitFiles) {
      const repoInfo = `## Repository Details:\n- Repository Path: ${repoPath}\n- Tracked Files: No files found.\n\n## Instruction for ChatGPT:\nAnalyze and suggest improvements, refactor code, or help in specific tasks like fixing bugs, adding features, or understanding code structure.`;
      if (outputFilePath) {
        fs.writeFileSync(outputFilePath, repoInfo, "utf-8");
      }
      return repoInfo;
    }

    const gitignorePath = path.join(repoPath, ".gitignore");
    const ig = ignore();
    if (fs.existsSync(gitignorePath)) {
      ig.add(fs.readFileSync(gitignorePath, "utf-8"));
    }

    const fileContents = await Promise.all(
      gitFiles.split("\n").map(async (file) => {
        const filePath = path.join(repoPath, file);
        if (!file || ig.ignores(file)) {
          return `### File: ${file}\nIgnored by .gitignore.`;
        }
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
          return `### File: ${file}\n\
\`\`\`\n${fs.readFileSync(filePath, "utf-8")}\n\`\`\``;
        }
        return `### File: ${file}\nFile not found or is not a regular file.`;
      })
    );

    const repoInfo = `## Repository Details:\n- Repository Path: ${repoPath}\n- Tracked Files:\n${gitFiles
      .split("\n")
      .map((file) => `- ${file}`)
      .join("\n")}\n\n## File Contents:\n${fileContents.join(
      "\n\n"
    )}\n\n## Instruction for ChatGPT:\nAnalyze and suggest improvements, refactor code, or help in specific tasks like fixing bugs, adding features, or understanding code structure.`;

    if (outputFilePath) {
      fs.writeFileSync(outputFilePath, repoInfo, "utf-8");
    }

    return repoInfo;
  } catch (err) {
    console.error("Error processing the repository:", err);
    throw err;
  }
}
