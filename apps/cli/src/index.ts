#!/usr/bin/env node
import { Command } from "commander";
import path from "node:path";
import pc from "picocolors";
import {
  readRegistry,
  addTemplateToRegistry,
  findTemplateBySlug,
} from "./registry";
import {
  cloneTemplate,
  handlePackageManagerTransition,
  initNewGitRepo,
} from "./utils";
import fs from "fs-extra";

const program = new Command();

program
  .name("scaffoldor")
  .description("Download templates from GitHub with ease")
  .version("1.0.0");

program
  .command("list")
  .description("List all available templates")
  .action(async () => {
    const registry = await readRegistry();
    if (registry.templates.length === 0) {
      console.log(pc.yellow("No templates found in registry."));
      return;
    }
    console.log(pc.cyan("Available Templates:"));
    registry.templates.forEach((t: any) => {
      console.log(
        `${pc.green(`@${t.slug}`)} [${t.type}] - ${
          t.description || "No description"
        }`
      );
    });
  });

program
  .command("add <slug> <url>")
  .description("Add a new template to the registry")
  .option(
    "-t, --type <type>",
    "Template type (e.g., backend, frontend)",
    "other"
  )
  .option("-d, --description <description>", "Template description")
  .action(
    async (
      slug: string,
      url: string,
      options: { type: string; description?: string }
    ) => {
      await addTemplateToRegistry({
        slug,
        url,
        type: options.type,
        description: options.description,
      });
      console.log(pc.green(`Template @${slug} added to registry.`));
    }
  );

program
  .argument(
    "<slug_or_command>",
    "Template slug (e.g., @nextjs-basic) or command"
  )
  .argument("[dest]", "Destination directory")
  .action(async (slugOrCommand: string, dest?: string) => {
    if (slugOrCommand.startsWith("@")) {
      const slug = slugOrCommand.slice(1);
      const template = await findTemplateBySlug(slug);

      if (!template) {
        console.error(
          pc.red(`Error: Template @${slug} not found in registry.`)
        );
        process.exit(1);
      }

      const destination = dest || `./${slug}`;
      const absoluteDest = path.resolve(process.cwd(), destination);

      if (await fs.pathExists(absoluteDest)) {
        console.error(
          pc.red(`Error: Destination ${destination} already exists.`)
        );
        process.exit(1);
      }

      try {
        await cloneTemplate(template.url, absoluteDest);
        await handlePackageManagerTransition(absoluteDest);
        await initNewGitRepo(absoluteDest);
        console.log(
          pc.green(`\nSuccessfully scaffolded @${slug} into ${destination}`)
        );
      } catch (error) {
        console.error(pc.red("Error during scaffolding:"), error);
        process.exit(1);
      }
    } else if (["list", "add"].includes(slugOrCommand)) {
      // Commander handles this if we call it correctly, but we need to pass it through
      // Actually, my list/add commands are already subcommands.
      // If the user types 'scaffoldor list', it hits the 'list' command.
      // If they type 'scaffoldor @slug', it hits this catch-all argument.
      console.error(
        pc.red(`Unknown command or invalid slug: ${slugOrCommand}`)
      );
    }
  });

program.parse(process.argv);
