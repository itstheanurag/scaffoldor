#!/usr/bin/env node
import { Command } from "commander";
import { listCommand } from "./commands/list";
import { searchCommand } from "./commands/search";
import { syncCommand } from "./commands/sync";
import { addCommand } from "./commands/add";
import { scaffoldCommand } from "./commands/scaffold";

const program = new Command();

program
  .name("scaffoldor")
  .description("Download templates from GitHub/GitLab with ease")
  .version("1.0.0");

program
  .command("list")
  .description("List all available templates")
  .option("-r, --remote", "Include templates from remote registry")
  .option("-t, --type <type>", "Filter by type (frontend, backend, etc.)")
  .option("-f, --framework <framework>", "Filter by framework")
  .option("-a, --author <author>", "Filter by author username")
  .action(listCommand);

program
  .command("search <query>")
  .description("Search templates by name, description, or tags")
  .option("-t, --type <type>", "Filter by type")
  .option("-f, --framework <framework>", "Filter by framework")
  .option("-a, --author <author>", "Filter by author username")
  .action(searchCommand);

program
  .command("sync")
  .description("Sync templates from remote registry to local cache")
  .action(syncCommand);

program
  .command("add <slug> <url>")
  .description("Add a new template to your local registry")
  .option("-t, --type <type>", "Template type", "other")
  .option("-f, --framework <framework>", "Template framework", "other")
  .option("-d, --description <description>", "Template description")
  .option("--tags <tags>", "Comma-separated tags")
  .option("--features <features>", "Comma-separated features")
  .action(addCommand);

program
  .argument(
    "<slug_or_command>",
    "Template slug (e.g., @ayushchug/backend) or command",
  )
  .argument("[dest]", "Destination directory")
  .action(async (slugOrCommand, dest) => {
    // If it's a known command, commander will handle it
    if (["list", "add", "search", "sync"].includes(slugOrCommand)) {
      return;
    }

    // Otherwise, assume it's a template slug for scaffolding
    await scaffoldCommand(slugOrCommand, dest);
  });

program.parse(process.argv);
