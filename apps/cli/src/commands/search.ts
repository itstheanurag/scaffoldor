import { searchTemplates } from "../registry";
import { UI } from "../helpers/ui";

export interface SearchOptions {
  type?: string;
  framework?: string;
  author?: string;
}

export async function searchCommand(query: string, options: SearchOptions) {
  UI.info(`Searching for "${query}"...`);

  const results = await searchTemplates({
    query,
    type: options.type,
    framework: options.framework,
  });

  let filteredResults = results;
  if (options.author) {
    const normalizedAuthor = options.author.startsWith("@")
      ? options.author.slice(1)
      : options.author;
    filteredResults = results.filter(
      (t) => t.author.github === normalizedAuthor,
    );
  }

  if (filteredResults.length === 0) {
    if (options.author) {
      UI.warn(
        `No templates found matching "${query}" for user '${options.author}'.`,
      );
    } else {
      UI.warn(`No templates found matching "${query}".`);
    }
    return;
  }

  UI.header(`Found ${filteredResults.length} template(s):`);

  filteredResults.forEach((t) => UI.templateItem(t));
}
