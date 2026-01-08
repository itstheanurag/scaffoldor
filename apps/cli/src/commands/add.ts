import { addTemplateToRegistry } from "../registry";
import { UI } from "../helpers/ui";
import {
  CommunityTemplate,
  TemplateTypeSchema,
  FrameworkSchema,
} from "@repo/schema";

export interface AddOptions {
  type: string;
  framework: string;
  description?: string;
  tags?: string;
  features?: string;
}

export async function addCommand(
  slug: string,
  url: string,
  options: AddOptions,
) {
  // Validate type
  const typeResult = TemplateTypeSchema.safeParse(options.type);
  if (!typeResult.success) {
    UI.warn(`Invalid type "${options.type}". Using "other".`);
    options.type = "other";
  }

  // Validate framework
  const frameworkResult = FrameworkSchema.safeParse(options.framework);
  if (!frameworkResult.success) {
    UI.warn(`Invalid framework "${options.framework}". Using "other".`);
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
    type: options.type as any,
    framework: options.framework as any,
    description: options.description,
    tags: options.tags ? options.tags.split(",").map((t) => t.trim()) : [],
    features: options.features
      ? options.features.split(",").map((f) => f.trim())
      : [],
    author: {
      name: "Local",
    },
    tier: "free",
    license: "MIT",
  };

  await addTemplateToRegistry(template);
  UI.success(`Template @${slug} added to local registry.`);
}
