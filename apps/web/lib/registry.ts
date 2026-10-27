/**
 * Registry data utilities for the web app
 * Imports the compiled registry.json and provides typed access
 */

import registryData from "../../../registry/registry.json";
import type { Registry, CommunityTemplate } from "@repo/schema";

export const registry: Registry = registryData as Registry;

export type CommunityTemplateWithUsername = CommunityTemplate & {
  _username: string;
};

/**
 * Get all templates as a flat array with registry username injected
 */
export function getAllTemplates(): CommunityTemplateWithUsername[] {
  return Object.entries(registry.templates).flatMap(([username, templates]) =>
    templates.map((t) => ({ ...t, _username: username })),
  );
}

/**
 * Get templates grouped by author
 */
export function getTemplatesByAuthor(): Record<string, CommunityTemplate[]> {
  return registry.templates;
}

/**
 * Get template by @author/slug format
 */
export function getTemplateBySlug(
  slug: string | undefined,
): CommunityTemplate | undefined {
  if (!slug) return undefined;
  // slug = @ayushchug/backend or ayushchug/backend
  const normalizedSlug = slug.startsWith("@") ? slug.slice(1) : slug;
  const [author, templateSlug] = normalizedSlug.split("/");
  return registry.templates[author]?.find((t) => t.slug === templateSlug);
}

/**
 * Get all templates by an author
 */
export function getAuthorTemplates(
  author: string | undefined,
): CommunityTemplate[] {
  if (!author) return [];
  const normalizedAuthor = author.startsWith("@") ? author.slice(1) : author;
  return registry.templates[normalizedAuthor] || [];
}

/**
 * Get all templates with a specific framework
 */
export function getTemplatesByFramework(
  framework: string,
): CommunityTemplate[] {
  return getAllTemplates().filter((t) => t.framework === framework);
}

/**
 * Get all templates of a specific type
 */
export function getTemplatesByType(type: string): CommunityTemplate[] {
  return getAllTemplates().filter((t) => t.type === type);
}

/**
 * Search templates by query
 */
export function searchTemplates(query: string): CommunityTemplate[] {
  const q = query.toLowerCase();
  return getAllTemplates().filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
}

/**
 * Get list of all authors
 */
export function getAllAuthors(): string[] {
  return Object.keys(registry.templates);
}

/**
 * Tags are free-form in submissions and may repeat, or repeat the framework
 * and category labels already shown as badges. Normalize them for display so
 * React keys stay unique and the card stays readable.
 */
export function getDisplayTags(
  template: Pick<CommunityTemplate, "tags" | "framework" | "type">,
): string[] {
  const seen = new Set<string>();
  const framework = template.framework.toLowerCase();
  const type = template.type.toLowerCase();

  return template.tags.filter((tag) => {
    const normalized = tag.toLowerCase();
    if (
      normalized === framework ||
      normalized === type ||
      seen.has(normalized)
    ) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}
