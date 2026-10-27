import { addTemplateToRegistry, LOCAL_AUTHOR } from "../registry";
import { UI } from "../helpers/ui";
import {
  CommunityTemplateSchema,
  formatZodError,
  type CommunityTemplate,
  type SourcePlatform,
} from "@repo/schema";
import {
  parseCommaSeparated,
  normalizeFramework,
  normalizeType,
} from "../helpers/options";
import { CliError } from "../helpers/errors";
import { normalizeRepoUrl } from "../utils";

export interface AddOptions {
  type: string;
  framework: string;
  description?: string;
  tags?: string;
  features?: string;
  name?: string;
  license?: string;
}

function detectPlatform(url: string): SourcePlatform {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (hostname === "github.com") return "github";
    if (hostname === "gitlab.com") return "gitlab";
  } catch {
    // normalizeRepoUrl already rejects malformed URLs.
  }
  return "custom";
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function addCommand(
  slug: string,
  url: string,
  options: AddOptions,
) {
  const normalizedSlug = slug.trim().replace(/^@/, "");
  if (normalizedSlug.includes("/")) {
    throw new CliError(
      `Invalid slug "${slug}". Use a plain slug such as "my-template" (without an author).`,
    );
  }

  const type = normalizeType(options.type);
  const framework = normalizeFramework(options.framework);
  const normalizedUrl = normalizeRepoUrl(url);
  const name = options.name?.trim() || titleFromSlug(normalizedSlug);

  const template: CommunityTemplate = {
    slug: normalizedSlug,
    name,
    url: normalizedUrl,
    platform: detectPlatform(normalizedUrl),
    type: (type ?? "other") as CommunityTemplate["type"],
    framework: (framework ?? "other") as CommunityTemplate["framework"],
    description: options.description?.trim() || undefined,
    tags: parseCommaSeparated(options.tags),
    features: parseCommaSeparated(options.features),
    author: {
      name: "Local",
    },
    tier: "free",
    license: options.license?.trim() || "MIT",
  };

  const result = CommunityTemplateSchema.safeParse(template);
  if (!result.success) {
    throw new CliError(`Invalid template:\n${formatZodError(result.error)}`);
  }

  const { updated } = await addTemplateToRegistry(result.data);

  UI.success(
    `Template @${LOCAL_AUTHOR}/${result.data.slug} ${
      updated ? "updated in" : "added to"
    } your local registry.`,
  );
  UI.dim(`Scaffold it with: scaffoldor @${LOCAL_AUTHOR}/${result.data.slug}`);
}
