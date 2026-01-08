import {
  searchTemplates,
  getAllTemplates,
  getAuthorTemplates,
} from "../registry";
import { UI } from "../helpers/ui";
import { TemplateWithUsername } from "../types";

export interface ListOptions {
  remote?: boolean;
  type?: string;
  framework?: string;
  author?: string;
}

export async function listCommand(options: ListOptions) {
  let templates: TemplateWithUsername[];

  if (options.remote) {
    UI.info("Fetching from remote registry...");
    templates = await searchTemplates({
      type: options.type,
      framework: options.framework,
    });

    // Manual filter for remote author if provided (since searchTemplates doesn't support it yet)
    if (options.author) {
      const normalizedAuthor = options.author.startsWith("@")
        ? options.author.slice(1)
        : options.author;
      templates = templates.filter((t) => t.author.github === normalizedAuthor);
    }
  } else {
    if (options.author) {
      templates = await getAuthorTemplates(options.author);

      // Apply filters if provided
      if (options.type) {
        templates = templates.filter((t) => t.type === options.type);
      }
      if (options.framework) {
        templates = templates.filter((t) => t.framework === options.framework);
      }
    } else {
      templates = await getAllTemplates();

      // Apply filters if provided
      if (options.type) {
        templates = templates.filter((t) => t.type === options.type);
      }
      if (options.framework) {
        templates = templates.filter((t) => t.framework === options.framework);
      }
    }
  }

  if (templates.length === 0) {
    if (options.author) {
      UI.warn(`No templates found for user '${options.author}'.`);
    } else {
      UI.warn("No templates found.");
    }

    if (!options.remote) {
      UI.dim("Tip: Use --remote to search the community registry");
    }
    return;
  }

  UI.header("Available Templates:");

  templates.forEach((t) => UI.templateItem(t));

  UI.dim(`Total: ${templates.length} template(s)\n`);
}
