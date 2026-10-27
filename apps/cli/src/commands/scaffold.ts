import path from "node:path";
import fs from "fs-extra";
import inquirer from "inquirer";
import {
  findTemplateBySlug,
  authorExists,
  getAuthorTemplates,
  parseTemplateSlug,
} from "../registry";
import {
  cloneTemplate,
  handlePackageManagerTransition,
  initNewGitRepo,
  isPackageManager,
  updatePackageJson,
  GIT_STRATEGIES,
  PACKAGE_MANAGERS,
  type GitStrategy,
} from "../utils";
import { UI } from "../helpers/ui";
import { CliError } from "../helpers/errors";
import { canPrompt } from "../helpers/prompt";

export interface ScaffoldOptions {
  git?: string;
  pm?: string;
  force?: boolean;
  yes?: boolean;
}

async function resolveGitStrategy(
  options: ScaffoldOptions,
): Promise<GitStrategy> {
  if (options.git) {
    const strategy = options.git.trim().toLowerCase();
    if (!GIT_STRATEGIES.includes(strategy as GitStrategy)) {
      throw new CliError(
        `Invalid git strategy "${options.git}". Use one of: ${GIT_STRATEGIES.join(", ")}.`,
      );
    }
    return strategy as GitStrategy;
  }

  if (!canPrompt({ yes: options.yes })) {
    return "fresh";
  }

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

  return gitChoice;
}

async function prepareDestination(
  destination: string,
  force: boolean,
): Promise<{ absoluteDest: string; exists: boolean }> {
  const absoluteDest = path.resolve(process.cwd(), destination);

  if (!(await fs.pathExists(absoluteDest))) {
    await fs.ensureDir(path.dirname(absoluteDest));
    return { absoluteDest, exists: false };
  }

  const stat = await fs.stat(absoluteDest);
  if (!stat.isDirectory()) {
    throw new CliError(
      `Destination ${destination} exists and is not a directory.`,
    );
  }

  const entries = await fs.readdir(absoluteDest);
  if (entries.length > 0 && !force) {
    throw new CliError(
      `Destination ${destination} already exists and is not empty.\n` +
        "Choose a different directory, or pass --force to overwrite conflicting files.",
    );
  }

  return { absoluteDest, exists: true };
}

export async function scaffoldCommand(
  slugInput?: string,
  dest?: string,
  options: ScaffoldOptions = {},
) {
  if (!slugInput || !slugInput.trim()) {
    throw new CliError(
      "Missing template name.\nUsage: scaffoldor <@author/slug> [destination]",
    );
  }

  // Validate flags before cloning so a typo never downloads or modifies files.
  const requestedManager = options.pm?.trim().toLowerCase();
  if (requestedManager && !isPackageManager(requestedManager)) {
    throw new CliError(
      `Invalid package manager "${options.pm}". Use one of: ${PACKAGE_MANAGERS.join(", ")}.`,
    );
  }

  const parsed = parseTemplateSlug(slugInput);
  if (!parsed) {
    throw new CliError(
      `Invalid template format: ${slugInput}\nUse @author/slug or author/slug (for example @itstheanurag/nest-backend).`,
    );
  }

  const template = await findTemplateBySlug(slugInput);

  if (!template) {
    if (parsed.author) {
      const userExists = await authorExists(parsed.author);
      if (userExists) {
        const suggestions = await getAuthorTemplates(parsed.author, {
          remote: true,
        });
        throw new CliError(
          `Template "${parsed.slug}" not found for user @${parsed.author}.` +
            (suggestions.length > 0
              ? `\n\nAvailable templates for @${parsed.author}:\n${suggestions
                  .map((entry) => `  - ${entry.slug}`)
                  .join("\n")}`
              : ""),
        );
      }

      throw new CliError(
        `User @${parsed.author} not found in the registry.\n` +
          'Run "scaffoldor sync" or "scaffoldor list --remote" to refresh the registry.',
      );
    }

    throw new CliError(
      `Template "${parsed.slug}" not found.\n` +
        'Try the @author/slug form, or run "scaffoldor search <query>" to find templates.',
    );
  }

  if (template.tier === "premium") {
    const purchase = template.pricing?.purchaseUrl
      ? `\nLearn more: ${template.pricing.purchaseUrl}`
      : "";
    throw new CliError(
      `"${template.name}" is a premium template and cannot be scaffolded yet.${purchase}`,
    );
  }

  const gitChoice = await resolveGitStrategy(options);
  const destination = dest || `./${template.slug}`;
  const { absoluteDest, exists } = await prepareDestination(
    destination,
    Boolean(options.force),
  );

  const tempDest = await fs.mkdtemp(
    path.join(path.dirname(absoluteDest), ".scaffoldor-"),
  );

  let placed = false;

  try {
    UI.info(
      `Scaffolding @${template.author.github || parsed.author || "local"}/${template.slug}...`,
    );

    UI.dim(`Name: ${template.name}`);
    UI.dim(`Type: ${template.type}`);
    if (template.framework !== "other") {
      UI.dim(`Framework: ${template.framework}`);
    }
    console.log("");

    await cloneTemplate(template.url, tempDest, gitChoice);

    // Update package.json name to match the destination folder.
    const projectName = path.basename(absoluteDest);
    await updatePackageJson(tempDest, projectName);

    const packageManager = await handlePackageManagerTransition(
      tempDest,
      requestedManager,
      { yes: options.yes },
    );

    // Only initialise a new repository if the user chose "fresh".
    if (gitChoice === "fresh") {
      await initNewGitRepo(tempDest);
    }

    if (!exists) {
      await fs.move(tempDest, absoluteDest);
    } else {
      await fs.copy(tempDest, absoluteDest, {
        overwrite: Boolean(options.force),
        errorOnExist: false,
      });
      await fs.remove(tempDest);
    }
    placed = true;

    UI.scaffoldSuccess(
      `${template.author.github || parsed.author || "local"}/${template.slug}`,
      destination,
      template.url,
      packageManager.manager,
    );
  } catch (error) {
    await fs.remove(tempDest).catch(() => undefined);

    if (!exists && !placed) {
      await fs.remove(absoluteDest).catch(() => undefined);
    }

    if (error instanceof CliError) throw error;

    const detail = error instanceof Error ? error.message : String(error);
    throw new CliError(`Scaffolding failed: ${detail}`);
  }
}
