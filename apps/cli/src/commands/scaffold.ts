import path from "node:path";
import fs from "fs-extra";
import inquirer from "inquirer";
import {
  findTemplateBySlug,
  authorExists,
  getAuthorTemplates,
} from "../registry";
import {
  cloneTemplate,
  handlePackageManagerTransition,
  initNewGitRepo,
  updatePackageJson,
  GitStrategy,
} from "../utils";
import { UI } from "../helpers/ui";

export async function scaffoldCommand(slugOrCommand: string, dest?: string) {
  if (!slugOrCommand.includes("/") && !slugOrCommand.startsWith("@")) {
    UI.error(`Invalid template format: ${slugOrCommand}`);
    UI.dim("Use @author/slug or author/slug format (e.g., @ayushchug/backend)");
    process.exit(1);
  }

  const normalizedSlug = slugOrCommand.startsWith("@")
    ? slugOrCommand.slice(1)
    : slugOrCommand;

  const [author, slug] = normalizedSlug.split("/");
  const template = await findTemplateBySlug(normalizedSlug);

  if (!template) {
    if (author) {
      const userExists = await authorExists(author);
      if (userExists) {
        UI.error(`Template '${slug}' not found for user @${author}.`);
        const suggestions = await getAuthorTemplates(author);
        if (suggestions.length > 0) {
          UI.info(`\nAvailable templates for @${author}:`);
          suggestions.forEach((s) => UI.dim(`  - ${s.slug}`));
        }
      } else {
        UI.error(`User @${author} not found in registry.`);
      }
    } else {
      UI.error(`Template '${normalizedSlug}' not found.`);
    }

    UI.dim(
      "\nTip: Use 'scaffoldor sync' to update your registry or 'scaffoldor search' to find templates"
    );
    process.exit(1);
  }

  // Check if premium template
  if (template.tier === "premium") {
    UI.warn("This is a premium template!");
    UI.dim("Premium templates are coming soon. Stay tuned!");
    if (template.pricing?.purchaseUrl) {
      UI.info(`Learn more: ${template.pricing.purchaseUrl}`);
    }
    process.exit(0);
  }

  const slugName = template.slug;
  const destination = dest || `./${slugName}`;
  const absoluteDest = path.resolve(process.cwd(), destination);

  if (await fs.pathExists(absoluteDest)) {
    UI.error(`Destination ${destination} already exists.`);
    process.exit(1);
  }

  try {
    UI.info(`Scaffolding @${template.author.github}/${template.slug}...`);

    // Show info
    UI.dim(`Name: ${template.name}`);
    UI.dim(`Type: ${template.type}`);
    if (template.framework !== "other") {
      UI.dim(`Framework: ${template.framework}`);
    }
    console.log("");

    // Ask user about git handling preference
    const { gitChoice } = await inquirer.prompt<{ gitChoice: GitStrategy }>([
      {
        type: "list",
        name: "gitChoice",
        message: "How would you like to handle git?",
        choices: [
          {
            name: "Fresh start (new repo with initial commit)",
            value: "fresh",
          },
          { name: "Keep original git history", value: "keep" },
          { name: "No git (remove .git entirely)", value: "remove" },
        ],
        default: "fresh",
      },
    ]);

    await cloneTemplate(template.url, absoluteDest, gitChoice);

    // Update package.json name to match destination
    const projectName = path.basename(absoluteDest);
    await updatePackageJson(absoluteDest, projectName);

    await handlePackageManagerTransition(absoluteDest);

    // Only init new repo if user chose "fresh"
    if (gitChoice === "fresh") {
      await initNewGitRepo(absoluteDest);
    }

    UI.scaffoldSuccess(
      `${template.author.github}/${template.slug}`,
      destination,
      template.url
    );
  } catch (error) {
    UI.error("Error during scaffolding:");
    console.error(error);
    process.exit(1);
  }
}
