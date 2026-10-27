#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { listCommand } from "./commands/list";
import { searchCommand } from "./commands/search";
import { syncCommand } from "./commands/sync";
import { addCommand } from "./commands/add";
import { scaffoldCommand } from "./commands/scaffold";
import { UI } from "./helpers/ui";
import {
  CliError,
  getErrorMessage,
  isPromptCancellation,
} from "./helpers/errors";
import { VERSION } from "./version";

const program = new Command();

program
  .name("scaffoldor")
  .description("Scaffold new projects from GitHub/GitLab templates")
  .version(VERSION, "-v, --version", "output the version number")
  .showHelpAfterError()
  .showSuggestionAfterError();

program
  .command("scaffold", { isDefault: true })
  .description("Scaffold a template (default command)")
  .argument("[slug]", "Template slug (e.g., @ayushchugh/backend)")
  .argument("[dest]", "Destination directory")
  .option(
    "-g, --git <strategy>",
    "Git handling: keep, fresh, or remove (default: prompt)",
  )
  .option(
    "-p, --pm <manager>",
    "Package manager: npm, pnpm, yarn, or bun (default: detect/prompt)",
  )
  .option("-f, --force", "Overwrite files in a non-empty destination")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(
    async (
      slug: string | undefined,
      dest: string | undefined,
      options: {
        git?: string;
        pm?: string;
        force?: boolean;
        yes?: boolean;
      },
    ) => {
      if (!slug) {
        program.help();
        return;
      }

      await scaffoldCommand(slug, dest, options);
    },
  );

program
  .command("list")
  .description("List templates from the local registry")
  .option("-r, --remote", "Include templates from the remote registry")
  .option("-t, --type <type>", "Filter by type (frontend, backend, etc.)")
  .option("-f, --framework <framework>", "Filter by framework")
  .option("-a, --author <author>", "Filter by author username")
  .option("--json", "Output machine-readable JSON")
  .action(listCommand);

program
  .command("search <query>")
  .description("Search templates by name, description, author, or tags")
  .option("-t, --type <type>", "Filter by type")
  .option("-f, --framework <framework>", "Filter by framework")
  .option("-a, --author <author>", "Filter by author username")
  .option("--json", "Output machine-readable JSON")
  .action(searchCommand);

program
  .command("sync")
  .description("Sync templates from the remote registry to the local cache")
  .action(syncCommand);

program
  .command("add <slug> <url>")
  .description("Add or update a template in your local registry")
  .option("-t, --type <type>", "Template type", "other")
  .option("-f, --framework <framework>", "Template framework", "other")
  .option("-d, --description <description>", "Template description")
  .option("--tags <tags>", "Comma-separated tags")
  .option("--features <features>", "Comma-separated features")
  .option("-n, --name <name>", "Human-readable template name")
  .option("--license <license>", "License identifier", "MIT")
  .action(addCommand);

program.addHelpText(
  "after",
  `
Examples:
  $ scaffoldor @itstheanurag/nest-backend my-app
  $ scaffoldor list --remote --type backend
  $ scaffoldor search nextjs --framework nextjs
  $ scaffoldor add my-template https://github.com/me/my-template --type fullstack
  $ scaffoldor sync

Documentation:
  https://github.com/itstheanurag/scaffoldor
`,
);

async function main(): Promise<void> {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    if (isPromptCancellation(error)) {
      console.log(pc.dim("\nCancelled."));
      process.exit(130);
    }

    if (error instanceof CliError) {
      UI.error(error.message);
      if (process.env.SCAFFOLDOR_DEBUG) console.error(error.stack);
      process.exit(error.exitCode);
    }

    UI.error(getErrorMessage(error));
    if (process.env.SCAFFOLDOR_DEBUG && error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

void main();
