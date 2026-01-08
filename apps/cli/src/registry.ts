import fs from "fs-extra";
import path from "node:path";
import { RegistrySchema, CommunityTemplate, Registry } from "@repo/schema";

const LOCAL_REGISTRY_PATH = path.join(process.cwd(), "registry.json");

/**
 * Remote registry URL - can be overridden via environment variable
 */
const REMOTE_REGISTRY_URL =
  process.env.SCAFFOLDOR_REGISTRY_URL ||
  "https://raw.githubusercontent.com/itstheanurag/scaffoldor/main/registry/registry.json";

/**
 * Helper to flatten templates from author-grouped structure to array
 */
export function flattenTemplates(registry: Registry): CommunityTemplate[] {
  return Object.values(registry.templates).flat();
}

/**
 * Read the local registry file
 */
export async function readLocalRegistry(): Promise<Registry> {
  if (!(await fs.pathExists(LOCAL_REGISTRY_PATH))) {
    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      templates: {},
    };
  }

  const data = await fs.readJson(LOCAL_REGISTRY_PATH);
  return RegistrySchema.parse(data);
}

/**
 * Write to local registry file
 */
export async function writeLocalRegistry(registry: Registry): Promise<void> {
  await fs.writeJson(LOCAL_REGISTRY_PATH, registry, { spaces: 2 });
}

/**
 * Fetch the remote community registry
 * Returns null if fetch fails (network error, invalid response, etc.)
 */
export async function fetchRemoteRegistry(): Promise<Registry | null> {
  try {
    const response = await fetch(REMOTE_REGISTRY_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": "scaffoldor-cli",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return RegistrySchema.parse(data);
  } catch {
    // Network error or invalid JSON - return null and fallback to local
    return null;
  }
}

/**
 * Read registry (local)
 */
export async function readRegistry(): Promise<Registry> {
  return readLocalRegistry();
}

/**
 * Get all templates as flat array from registry
 */
export async function getAllTemplates(): Promise<CommunityTemplate[]> {
  const registry = await readLocalRegistry();
  return flattenTemplates(registry);
}

/**
 * Find a template by slug (@author/template or just template)
 * Searches local first, then remote registry
 */
export async function findTemplateBySlug(
  slug: string,
): Promise<CommunityTemplate | undefined> {
  // Handle @author/template format
  const normalizedSlug = slug.startsWith("@") ? slug.slice(1) : slug;
  const hasAuthor = normalizedSlug.includes("/");

  // 1. Check local registry first
  const local = await readLocalRegistry();

  if (hasAuthor) {
    const parts = normalizedSlug.split("/");
    const author = parts[0];
    const templateSlug = parts[1];
    if (author && templateSlug) {
      const localTemplate = local.templates[author]?.find(
        (t: CommunityTemplate) => t.slug === templateSlug,
      );
      if (localTemplate) return localTemplate;
    }
  } else {
    // Search all authors for the slug
    const localTemplate = flattenTemplates(local).find(
      (t: CommunityTemplate) => t.slug === normalizedSlug,
    );
    if (localTemplate) return localTemplate;
  }

  // 2. Fallback to remote registry
  const remote = await fetchRemoteRegistry();
  if (remote) {
    if (hasAuthor) {
      const parts = normalizedSlug.split("/");
      const author = parts[0];
      const templateSlug = parts[1];
      if (author && templateSlug) {
        return remote.templates[author]?.find(
          (t: CommunityTemplate) => t.slug === templateSlug,
        );
      }
    } else {
      return flattenTemplates(remote).find(
        (t: CommunityTemplate) => t.slug === normalizedSlug,
      );
    }
  }

  return undefined;
}
/**
 * Get all templates for a specific author
 */
export async function getAuthorTemplates(
  author: string,
): Promise<CommunityTemplate[]> {
  const local = await readLocalRegistry();
  const normalizedAuthor = author.startsWith("@") ? author.slice(1) : author;
  return local.templates[normalizedAuthor] || [];
}

/**
 * Check if an author exists in the local registry
 */
export async function authorExists(author: string): Promise<boolean> {
  const local = await readLocalRegistry();
  const normalizedAuthor = author.startsWith("@") ? author.slice(1) : author;
  return !!local.templates[normalizedAuthor];
}

/**
 * Search templates in both local and remote registries
 */
export async function searchTemplates(options?: {
  type?: string;
  framework?: string;
  tag?: string;
  query?: string;
}): Promise<CommunityTemplate[]> {
  const local = await readLocalRegistry();
  const remote = await fetchRemoteRegistry();

  const localTemplates = flattenTemplates(local);
  const remoteTemplates = remote ? flattenTemplates(remote) : [];

  // Combine templates (local takes priority for duplicates)
  const slugSet = new Set(localTemplates.map((t: CommunityTemplate) => t.slug));
  const allTemplates = [
    ...localTemplates,
    ...remoteTemplates.filter((t: CommunityTemplate) => !slugSet.has(t.slug)),
  ];

  // Apply filters
  return allTemplates.filter((t: CommunityTemplate) => {
    if (options?.type && t.type !== options.type) return false;
    if (options?.framework && t.framework !== options.framework) return false;
    if (options?.tag && !t.tags.includes(options.tag)) return false;
    if (options?.query) {
      const q = options.query.toLowerCase();
      const searchable = [
        t.slug,
        t.name,
        t.description || "",
        ...t.tags,
        ...t.features,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

/**
 * Add a template to the local registry under "local" author
 */
export async function addTemplateToRegistry(
  template: CommunityTemplate,
): Promise<void> {
  const registry = await readLocalRegistry();
  const author = template.author.github || "local";

  if (!registry.templates[author]) {
    registry.templates[author] = [];
  }

  const existingIndex = registry.templates[author].findIndex(
    (t: CommunityTemplate) => t.slug === template.slug,
  );

  if (existingIndex !== -1) {
    registry.templates[author][existingIndex] = template;
  } else {
    registry.templates[author].push(template);
  }

  registry.lastUpdated = new Date().toISOString();
  await writeLocalRegistry(registry);
}

/**
 * Sync remote registry to local cache
 */
export async function syncRegistry(): Promise<boolean> {
  const remote = await fetchRemoteRegistry();
  if (!remote) {
    return false;
  }

  await writeLocalRegistry(remote);
  return true;
}
