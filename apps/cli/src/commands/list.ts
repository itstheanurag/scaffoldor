import { searchTemplates } from "../registry";
import { UI } from "../helpers/ui";
import {
  normalizeAuthor,
  normalizeFramework,
  normalizeType,
} from "../helpers/options";
import type { TemplateWithUsername } from "../types";

export interface ListOptions {
  remote?: boolean;
  type?: string;
  framework?: string;
  author?: string;
  json?: boolean;
}

export async function listCommand(options: ListOptions) {
  const type = normalizeType(options.type);
  const framework = normalizeFramework(options.framework);
  const author = normalizeAuthor(options.author);

  if (options.remote && !options.json) {
    UI.info("Fetching from remote registry...");
  }

  const templates = await searchTemplates({
    type,
    framework,
    author,
    includeRemote: Boolean(options.remote),
  });

  const sorted = [...templates].sort((a, b) => {
    const authorCompare = a.username.localeCompare(b.username);
    return authorCompare !== 0 ? authorCompare : a.slug.localeCompare(b.slug);
  });

  if (options.json) {
    console.log(JSON.stringify(sorted, null, 2));
    return;
  }

  if (sorted.length === 0) {
    if (author) {
      UI.warn(`No templates found for user '@${author}'.`);
    } else {
      UI.warn("No templates found.");
    }

    if (!options.remote) {
      UI.dim("Tip: Use --remote to include the community registry.");
    }
    return;
  }

  UI.header("Available Templates:");

  sorted.forEach((template: TemplateWithUsername) => UI.templateItem(template));

  UI.dim(`Total: ${sorted.length} template(s)\n`);
}
