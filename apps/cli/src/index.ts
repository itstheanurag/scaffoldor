#!/usr/bin/env node
import { Command } from "commander";
import path from "node:path";
import pc from "picocolors";
import {
  readRegistry,
  addTemplateToRegistry,
  findTemplateBySlug,
  searchTemplates,
  syncRegistry,
} from "./registry";
import {
  cloneTemplate,
  handlePackageManagerTransition,
  initNewGitRepo,
} from "./utils";
import {
  CommunityTemplate,
  TemplateTypeSchema,
  FrameworkSchema,
} from "@repo/schema";

import fs from "fs-extra";

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
  .action(
    async (options: {
      remote?: boolean;
      type?: string;
      framework?: string;
    }) => {
      let templates: CommunityTemplate[];

      if (options.remote) {
        console.log(pc.blue("Fetching from remote registry..."));
        templates = await searchTemplates({
          type: options.type,
          framework: options.framework,
        });
      } else {
        const registry = await readRegistry();
        templates = registry.templates;

        // Apply filters if provided
        if (options.type) {
          templates = templates.filter((t) => t.type === options.type);
        }
        if (options.framework) {
          templates = templates.filter(
            (t) => t.framework === options.framework
          );
        }
      }

      if (templates.length === 0) {
        console.log(pc.yellow("No templates found."));
        if (!options.remote) {
          console.log(
            pc.dim("Tip: Use --remote to search the community registry")
          );
        }
        return;
      }

      console.log(pc.cyan("\nAvailable Templates:\n"));

      templates.forEach((t) => {
        const tierBadge =
          t.tier === "premium"
            ? pc.yellow(" [PREMIUM - Coming Soon]")
            : pc.green(" [FREE]");

        const typeBadge = pc.dim(`[${t.type}]`);
        const frameworkBadge =
          t.framework !== "other" ? pc.blue(` (${t.framework})`) : "";

        console.log(`${pc.bold(pc.cyan(`@${t.slug}`))}${tierBadge}`);
        console.log(
          `${typeBadge}${frameworkBadge} ${t.description || "No description"}`
        );

        if (t.tags.length > 0) {
          console.log(
            `Tags: ${t.tags.map((tag: string) => pc.magenta(tag)).join(", ")}`
          );
        }

        if (t.author) {
          console.log(
            `${pc.dim("Author:")} ${t.author.name}${t.author.github ? ` (@${t.author.github})` : ""}`
          );
        }

        console.log("");
      });

      console.log(pc.dim(`Total: ${templates.length} template(s)\n`));
    }
  );

program
  .command("search <query>")
  .description("Search templates by name, description, or tags")
  .option("-t, --type <type>", "Filter by type")
  .option("-f, --framework <framework>", "Filter by framework")
  .action(
    async (query: string, options: { type?: string; framework?: string }) => {
      console.log(pc.blue(`Searching for "${query}"...`));

      const results = await searchTemplates({
        query,
        type: options.type,
        framework: options.framework,
      });

      if (results.length === 0) {
        console.log(pc.yellow("No templates found matching your query."));
        return;
      }

      console.log(pc.cyan(`\nFound ${results.length} template(s):\n`));

      results.forEach((t) => {
        const tierBadge = t.tier === "premium" ? pc.yellow(" [PREMIUM]") : "";
        console.log(`${pc.bold(pc.cyan(`@${t.slug}`))}${tierBadge}`);
        console.log(`${t.description || "No description"}`);
        console.log("");
      });
    }
  );

program
  .command("sync")
  .description("Sync templates from remote registry to local cache")
  .action(async () => {
    console.log(pc.blue("Syncing from remote registry..."));

    const success = await syncRegistry();

    if (success) {
      console.log(pc.green("Registry synced successfully!"));
    } else {
      console.log(
        pc.red("Failed to sync registry. Check your internet connection.")
      );
    }
  });

program
  .command("add <slug> <url>")
  .description("Add a new template to your local registry")
  .option("-t, --type <type>", "Template type", "other")
  .option("-f, --framework <framework>", "Template framework", "other")
  .option("-d, --description <description>", "Template description")
  .option("--tags <tags>", "Comma-separated tags")
  .option("--features <features>", "Comma-separated features")
  .action(
    async (
      slug: string,
      url: string,
      options: {
        type: string;
        framework: string;
        description?: string;
        tags?: string;
        features?: string;
      }
    ) => {
      // Validate type
      const typeResult = TemplateTypeSchema.safeParse(options.type);
      if (!typeResult.success) {
        console.log(
          pc.yellow(`Invalid type "${options.type}". Using "other".`)
        );
        options.type = "other";
      }

      // Validate framework
      const frameworkResult = FrameworkSchema.safeParse(options.framework);
      if (!frameworkResult.success) {
        console.log(
          pc.yellow(`Invalid framework "${options.framework}". Using "other".`)
        );
        options.framework = "other";
      }

      // Detect platform from URL
      const platform = url.includes("github.com")
        ? "github"
        : url.includes("gitlab.com")
          ? "gitlab"
          : "custom";

      const template: CommunityTemplate = {
        slug,
        name: slug
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" "),
        url,
        platform,
        type: options.type as CommunityTemplate["type"],
        framework: options.framework as CommunityTemplate["framework"],
        description: options.description,
        tags: options.tags ? options.tags.split(",").map((t) => t.trim()) : [],
        features: options.features
          ? options.features.split(",").map((f) => f.trim())
          : [],
        author: {
          name: "Local",
        },
        stats: {
          stars: 0,
          downloads: 0,
        },
        tier: "free",
        license: "MIT",
      };

      await addTemplateToRegistry(template);
      console.log(pc.green(` Template @${slug} added to local registry.`));
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
        console.error(pc.red(`Error: Template @${slug} not found.`));
        console.log(pc.dim("Tip: Use 'scaffoldor search' to find templates"));
        process.exit(1);
      }

      // Check if premium template
      if (template.tier === "premium") {
        console.log(pc.yellow("\n⭐ This is a premium template!"));
        console.log(pc.dim("Premium templates are coming soon. Stay tuned!\n"));
        if (template.pricing?.purchaseUrl) {
          console.log(pc.blue(`Learn more: ${template.pricing.purchaseUrl}`));
        }
        process.exit(0);
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
        console.log(pc.cyan(`\nScaffolding @${slug}...\n`));

        // Show template info
        console.log(pc.dim(`Name: ${template.name}`));
        console.log(pc.dim(`Type: ${template.type}`));
        if (template.framework !== "other") {
          console.log(pc.dim(`  Framework: ${template.framework}`));
        }
        console.log("");

        await cloneTemplate(template.url, absoluteDest);
        await handlePackageManagerTransition(absoluteDest);
        await initNewGitRepo(absoluteDest);

        console.log(
          pc.green(`\n Successfully scaffolded @${slug} into ${destination}`)
        );
        console.log(pc.dim("\nNext steps:"));
        console.log(pc.dim(`cd ${destination}`));
        console.log(pc.dim("npm install (or your preferred package manager)"));
      } catch (error) {
        console.error(pc.red("Error during scaffolding:"), error);
        process.exit(1);
      }
    } else if (["list", "add", "search", "sync"].includes(slugOrCommand)) {
      // Commander handles this - these are subcommands
    } else {
      console.error(
        pc.red(`Unknown command or invalid slug: ${slugOrCommand}`)
      );
      console.log(
        pc.dim("Use @ prefix for templates (e.g., scaffoldor @nextjs-basic)")
      );
      console.log(pc.dim("Or run: scaffoldor --help"));
      process.exit(1);
    }
  });

program.parse(process.argv);
