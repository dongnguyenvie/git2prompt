
# @nolanx/git2prompt

**Export a Git repository into an LLM-ready prompt for AI analysis.**

## Features
- Extracts tracked files from a Git repository
- Reads file contents while respecting `.gitignore` and `.git2promptignore`
- Generates a structured prompt for AI models like ChatGPT
- CLI support for quick usage

## Installation

You can install the package globally:

```sh
npm install -g @nolanx/git2prompt
```

Or use it directly with `npx`:

```sh
npx @nolanx/git2prompt /path/to/repo -o output.md
```

## Usage

### CLI Usage

```sh
npx @nolanx/git2prompt <repoPath> [options]
```

#### Options:
- `-o, --output <path>`  Path to save the generated output file (Optional)
- `-V, --version`        Show package version
- `-h, --help`           Show help menu

#### Example:

```sh
npx @nolanx/git2prompt /path/to/repo -o output.md
```

This will generate a structured output of the Git repository and save it to `output.md`.

### Output Format Example

After running the command, the output file will contain a structured prompt like this:

```
## Repository Details:
- Repository Path: /path/to/repo
- Tracked Files:
  - index.js
  - app.ts
  - utils/helpers.js

## File Contents:

### File: index.js
console.log("Hello, world!");

### File: app.ts
export function greet(name: string) {
  return `Hello, ${name}`;
}

### File: utils/helpers.js
module.exports = function add(a, b) {
  return a + b;
};

## Instruction for ChatGPT:
Analyze the above repository, suggest improvements, refactor code, or help with specific tasks like fixing bugs, adding features, or understanding the code structure.
```

### Programmatic Usage

You can use it in a Node.js project:

```ts
import { exportGitToPrompt } from "@nolanx/git2prompt";

(async () => {
  const output = await exportGitToPrompt("/path/to/repo");
  console.log(output);
})();
```


## License

MIT License
