import fs from "fs-extra";
import path from "node:path";
import { RegistrySchema, CommunityTemplate, Registry } from "@repo/schema";

const LOCAL_REGISTRY_PATH = path.join(process.cwd(), "registry.json");

/**
 * Remote registry URL - can be overridden via environment variable
 */
const REMOTE_REGISTRY_URL =
  process.env.SCAFFOLDOR_REGISTRY_URL ||
  "https://raw.githubusercontent.com/scaffoldor/registry/main/registry.json";

/**
 * Read the local registry file
 */
export async function readLocalRegistry(): Promise<Registry> {
  if (!(await fs.pathExists(LOCAL_REGISTRY_PATH))) {
    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      templates: [],
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
 * Find a template by slug
 * Searches local first, then remote registry
 */
export async function findTemplateBySlug(
  slug: string
): Promise<CommunityTemplate | undefined> {
  // 1. Check local registry first
  const local = await readLocalRegistry();
  const localTemplate = local.templates.find(
    (t: CommunityTemplate) => t.slug === slug
  );
  if (localTemplate) {
    return localTemplate;
  }

  // 2. Fallback to remote registry
  const remote = await fetchRemoteRegistry();
  if (remote) {
    return remote.templates.find((t: CommunityTemplate) => t.slug === slug);
  }

  return undefined;
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

  // Combine templates (local takes priority for duplicates)
  const slugSet = new Set(
    local.templates.map((t: CommunityTemplate) => t.slug)
  );
  const allTemplates = [
    ...local.templates,
    ...(remote?.templates.filter(
      (t: CommunityTemplate) => !slugSet.has(t.slug)
    ) || []),
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
 * Add a template to the local registry
 */
export async function addTemplateToRegistry(
  template: CommunityTemplate
): Promise<void> {
  const registry = await readLocalRegistry();
  const existingIndex = registry.templates.findIndex(
    (t: CommunityTemplate) => t.slug === template.slug
  );

  if (existingIndex !== -1) {
    registry.templates[existingIndex] = template;
  } else {
    registry.templates.push(template);
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
