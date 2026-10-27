import { searchTemplates } from "../registry";
import { UI } from "../helpers/ui";
import {
  normalizeAuthor,
  normalizeFramework,
  normalizeType,
} from "../helpers/options";
import { CliError } from "../helpers/errors";

export interface SearchOptions {
  type?: string;
  framework?: string;
  author?: string;
  json?: boolean;
}

export async function searchCommand(query: string, options: SearchOptions) {
  const type = normalizeType(options.type);
  const framework = normalizeFramework(options.framework);
  const author = normalizeAuthor(options.author);

  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    throw new CliError("Search query cannot be empty.");
  }

  if (!options.json) {
    UI.info(`Searching for "${normalizedQuery}"...`);
  }

  const templates = await searchTemplates({
    query: normalizedQuery,
    type,
    framework,
    author,
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
      UI.warn(
        `No templates found matching "${normalizedQuery}" for user '@${author}'.`,
      );
    } else {
      UI.warn(`No templates found matching "${normalizedQuery}".`);
    }
    return;
  }

  UI.header(`Found ${sorted.length} template(s):`);

  sorted.forEach((template) => UI.templateItem(template));
}
