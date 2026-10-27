import fs from "fs-extra";
import path from "node:path";
import os from "node:os";
import {
  CommunityTemplateSchema,
  RegistrySchema,
  formatZodError,
  type CommunityTemplate,
  type Registry,
} from "@repo/schema";
import { TemplateWithUsername } from "./types";
import { UI } from "./helpers/ui";
import { CliError } from "./helpers/errors";
import { VERSION } from "./version";

const DEFAULT_REGISTRY_URL =
  "https://raw.githubusercontent.com/itstheanurag/scaffoldor/main/registry/registry.json";

/**
 * Local data directory. `SCAFFOLDOR_HOME` is primarily useful for CI and
 * tests, but power users can use it to keep multiple registries around.
 */
export const SCAFFOLDOR_DIR = process.env.SCAFFOLDOR_HOME?.trim()
  ? path.resolve(process.env.SCAFFOLDOR_HOME)
  : path.join(os.homedir(), ".scaffoldor");

export const LOCAL_REGISTRY_PATH = path.join(SCAFFOLDOR_DIR, "registry.json");

export const LOCAL_AUTHOR = "local";

export const REMOTE_REGISTRY_URL =
  process.env.SCAFFOLDOR_REGISTRY_URL?.trim() || DEFAULT_REGISTRY_URL;

const FETCH_TIMEOUT_MS = (() => {
  const configured = Number(process.env.SCAFFOLDOR_REGISTRY_TIMEOUT);
  return Number.isFinite(configured) && configured > 0 ? configured : 15_000;
})();

/**
 * Ensure the scaffoldor directory exists.
 */
async function ensureScaffoldorDir(): Promise<void> {
  await fs.ensureDir(SCAFFOLDOR_DIR);
}

function createEmptyRegistry(): Registry {
  return {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    templates: {},
  };
}

/**
 * Helper to flatten templates from author-grouped structure to array.
 * Preserves the registry username key with each template.
 */
export function flattenTemplates(registry: Registry): TemplateWithUsername[] {
  const result: TemplateWithUsername[] = [];
  for (const [username, templates] of Object.entries(registry.templates)) {
    for (const template of templates) {
      result.push({ ...template, username });
    }
  }
  return result;
}

function findAuthorKey(registry: Registry, author: string): string | undefined {
  if (registry.templates[author]) return author;

  const normalized = author.toLowerCase();
  return Object.keys(registry.templates).find(
    (key) => key.toLowerCase() === normalized,
  );
}

function getAuthorTemplatesFromRegistry(
  registry: Registry,
  author: string,
): TemplateWithUsername[] {
  const key = findAuthorKey(registry, author);
  if (!key) return [];

  return (registry.templates[key] ?? []).map((template) => ({
    ...template,
    username: key,
  }));
}

function findTemplateInRegistry(
  registry: Registry,
  author: string | undefined,
  slug: string,
): CommunityTemplate | undefined {
  if (author) {
    const key = findAuthorKey(registry, author);
    if (!key) return undefined;
    return registry.templates[key]?.find((template) => template.slug === slug);
  }

  return flattenTemplates(registry).find((template) => template.slug === slug);
}

/**
 * Read the local registry file. A corrupt or outdated registry is backed up
 * instead of crashing every command with a raw Zod error.
 */
export async function readLocalRegistry(): Promise<Registry> {
  if (!(await fs.pathExists(LOCAL_REGISTRY_PATH))) {
    return createEmptyRegistry();
  }

  try {
    const data = await fs.readJson(LOCAL_REGISTRY_PATH);
    const result = RegistrySchema.safeParse(data);

    if (!result.success) {
      throw new Error(formatZodError(result.error));
    }

    return result.data;
  } catch {
    const backupPath = path.join(
      SCAFFOLDOR_DIR,
      `registry.corrupt-${Date.now()}.json`,
    );

    let backedUp = false;
    try {
      await fs.move(LOCAL_REGISTRY_PATH, backupPath, { overwrite: true });
      backedUp = true;
    } catch {
      // If the file cannot be moved, still continue with an empty registry.
    }

    UI.warn(
      backedUp
        ? `Your local registry was invalid and has been backed up to:\n  ${backupPath}`
        : `Your local registry at ${LOCAL_REGISTRY_PATH} is invalid and could not be backed up.`,
    );
    UI.dim('Run "scaffoldor sync" to rebuild the local registry.');

    return createEmptyRegistry();
  }
}

/**
 * Write the local registry atomically so an interrupted write cannot leave a
 * half-written JSON file behind.
 */
export async function writeLocalRegistry(registry: Registry): Promise<void> {
  const validated = RegistrySchema.parse(registry);

  await ensureScaffoldorDir();
  const tempPath = `${LOCAL_REGISTRY_PATH}.${process.pid}.tmp`;

  try {
    await fs.writeJson(tempPath, validated, { spaces: 2 });
    await fs.move(tempPath, LOCAL_REGISTRY_PATH, { overwrite: true });
  } finally {
    await fs.remove(tempPath).catch(() => undefined);
  }
}

export interface RemoteRegistryResult {
  registry: Registry | null;
  error?: string;
}

/**
 * Fetch the remote community registry, returning a useful error instead of
 * silently swallowing the reason for a failure.
 */
export async function fetchRemoteRegistryResult(): Promise<RemoteRegistryResult> {
  let response: Response;

  try {
    response = await fetch(REMOTE_REGISTRY_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": `scaffoldor-cli/${VERSION}`,
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return {
      registry: null,
      error: timedOut
        ? `Request timed out after ${FETCH_TIMEOUT_MS / 1000}s.`
        : "Could not reach the remote registry. Check your internet connection.",
    };
  }

  if (!response.ok) {
    return {
      registry: null,
      error: `Remote registry returned HTTP ${response.status} (${response.statusText}).`,
    };
  }

  try {
    const data = await response.json();
    const result = RegistrySchema.safeParse(data);

    if (!result.success) {
      return {
        registry: null,
        error: `Remote registry is invalid:\n${formatZodError(result.error)}`,
      };
    }

    return { registry: result.data };
  } catch {
    return {
      registry: null,
      error: "Remote registry did not contain valid JSON.",
    };
  }
}

/**
 * Fetch the remote community registry.
 * Returns null if the fetch fails; use fetchRemoteRegistryResult() when the
 * failure reason matters.
 */
export async function fetchRemoteRegistry(): Promise<Registry | null> {
  return (await fetchRemoteRegistryResult()).registry;
}

/**
 * Read registry (local).
 */
export async function readRegistry(): Promise<Registry> {
  return readLocalRegistry();
}

/**
 * Get all templates as a flat array from the local registry.
 */
export async function getAllTemplates(): Promise<TemplateWithUsername[]> {
  const registry = await readLocalRegistry();
  return flattenTemplates(registry);
}

export interface ParsedTemplateSlug {
  author?: string;
  slug: string;
}

/**
 * Parse `@author/slug`, `author/slug`, or a bare `slug`.
 * Returns null for malformed values such as `a/b/c` or an empty string.
 */
export function parseTemplateSlug(input: string): ParsedTemplateSlug | null {
  const value = input.trim().replace(/^@/, "");
  if (!value) return null;

  const parts = value.split("/");
  if (parts.some((part) => part.length === 0)) return null;

  const slug = parts[parts.length - 1]?.toLowerCase();
  if (!slug) return null;

  if (parts.length === 1) return { slug };
  if (parts.length === 2) {
    return { author: parts[0]?.toLowerCase(), slug };
  }

  return null;
}

/**
 * Find a template by slug. Local templates take priority over remote ones.
 */
export async function findTemplateBySlug(
  input: string,
): Promise<CommunityTemplate | undefined> {
  const parsed = parseTemplateSlug(input);
  if (!parsed) return undefined;

  const local = await readLocalRegistry();
  const localTemplate = findTemplateInRegistry(
    local,
    parsed.author,
    parsed.slug,
  );
  if (localTemplate) return localTemplate;

  const remoteResult = await fetchRemoteRegistryResult();
  if (!remoteResult.registry) {
    throw new CliError(
      `Could not load the community registry.${remoteResult.error ? `\n${remoteResult.error}` : ""}\n\nIf the template is local, check the @author/slug spelling. Otherwise try again or run "scaffoldor sync".`,
    );
  }

  return findTemplateInRegistry(
    remoteResult.registry,
    parsed.author,
    parsed.slug,
  );
}

/**
 * Get all templates for a specific author. Remote templates can optionally
 * be included (used for "did you mean" suggestions).
 */
export async function getAuthorTemplates(
  author: string,
  options: { remote?: boolean } = {},
): Promise<TemplateWithUsername[]> {
  const normalizedAuthor = author.trim().replace(/^@/, "");
  const local = await readLocalRegistry();
  const localTemplates = getAuthorTemplatesFromRegistry(
    local,
    normalizedAuthor,
  );

  if (!options.remote) return localTemplates;

  const remote = await fetchRemoteRegistry();
  if (!remote) return localTemplates;

  const remoteTemplates = getAuthorTemplatesFromRegistry(
    remote,
    normalizedAuthor,
  );
  const seen = new Set(
    localTemplates.map((template) => `${template.username}/${template.slug}`),
  );

  return [
    ...localTemplates,
    ...remoteTemplates.filter(
      (template) => !seen.has(`${template.username}/${template.slug}`),
    ),
  ];
}

/**
 * Check if an author exists locally or in the remote registry.
 */
export async function authorExists(author: string): Promise<boolean> {
  const normalizedAuthor = author.trim().replace(/^@/, "");
  const local = await readLocalRegistry();
  if (findAuthorKey(local, normalizedAuthor)) return true;

  const remote = await fetchRemoteRegistry();
  return remote ? Boolean(findAuthorKey(remote, normalizedAuthor)) : false;
}

export interface SearchOptions {
  type?: string;
  framework?: string;
  tag?: string;
  query?: string;
  author?: string;
  /** Set to false to search only the local cache. */
  includeRemote?: boolean;
}

function matchesAuthor(
  template: TemplateWithUsername,
  author: string,
): boolean {
  const normalized = author.trim().replace(/^@/, "").toLowerCase();
  return (
    template.username.toLowerCase() === normalized ||
    template.author.github?.toLowerCase() === normalized
  );
}

/**
 * Search templates in both local and remote registries.
 */
export async function searchTemplates(
  options: SearchOptions = {},
): Promise<TemplateWithUsername[]> {
  const local = await readLocalRegistry();
  const remote =
    options.includeRemote === false ? null : await fetchRemoteRegistry();

  const localTemplates = flattenTemplates(local);
  const remoteTemplates = remote ? flattenTemplates(remote) : [];

  // Local takes priority for the same author/slug pair. Different authors are
  // allowed to publish templates with the same slug.
  const seen = new Set(
    localTemplates.map((template) => `${template.username}/${template.slug}`),
  );
  const allTemplates = [
    ...localTemplates,
    ...remoteTemplates.filter(
      (template) => !seen.has(`${template.username}/${template.slug}`),
    ),
  ];

  return allTemplates.filter((template) => {
    if (options.type && template.type !== options.type) return false;
    if (options.framework && template.framework !== options.framework) {
      return false;
    }
    if (options.tag) {
      const tag = options.tag.toLowerCase();
      if (!template.tags.some((value) => value.toLowerCase() === tag)) {
        return false;
      }
    }
    if (options.author && !matchesAuthor(template, options.author)) {
      return false;
    }
    if (options.query) {
      const query = options.query.toLowerCase();
      const searchable = [
        template.slug,
        template.name,
        template.description ?? "",
        template.username,
        template.author.name,
        ...template.tags,
        ...template.features,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });
}

/**
 * Add or update a template in the local registry. Local templates are always
 * stored under the "local" author so `sync` can preserve them safely.
 */
export async function addTemplateToRegistry(
  template: CommunityTemplate,
): Promise<{ updated: boolean }> {
  const validated = CommunityTemplateSchema.parse(template);
  const registry = await readLocalRegistry();

  const templates = registry.templates[LOCAL_AUTHOR] ?? [];
  const existingIndex = templates.findIndex(
    (entry) => entry.slug === validated.slug,
  );
  const updated = existingIndex !== -1;

  if (updated) {
    templates[existingIndex] = validated;
  } else {
    templates.push(validated);
  }

  registry.templates[LOCAL_AUTHOR] = [...templates].sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
  registry.lastUpdated = new Date().toISOString();

  await writeLocalRegistry(registry);
  return { updated };
}

export interface SyncResult {
  ok: boolean;
  error?: string;
  preserved: number;
  total: number;
}

/**
 * Sync the remote registry to the local cache. Locally added templates (the
 * "local" author bucket) survive a sync; all other cached entries are replaced
 * so stale templates are removed.
 */
export async function syncRegistry(): Promise<SyncResult> {
  const remoteResult = await fetchRemoteRegistryResult();
  if (!remoteResult.registry) {
    return {
      ok: false,
      error: remoteResult.error,
      preserved: 0,
      total: 0,
    };
  }

  const remote = remoteResult.registry;
  const local = await readLocalRegistry();
  const localTemplates = local.templates[LOCAL_AUTHOR] ?? [];

  const templates: Registry["templates"] = { ...remote.templates };

  if (localTemplates.length > 0) {
    const mergedBySlug = new Map<string, CommunityTemplate>();
    for (const template of remote.templates[LOCAL_AUTHOR] ?? []) {
      mergedBySlug.set(template.slug, template);
    }
    for (const template of localTemplates) {
      mergedBySlug.set(template.slug, template);
    }

    templates[LOCAL_AUTHOR] = [...mergedBySlug.values()].sort((a, b) =>
      a.slug.localeCompare(b.slug),
    );
  }

  const registry: Registry = {
    ...remote,
    lastUpdated: new Date().toISOString(),
    templates,
  };

  await writeLocalRegistry(registry);

  return {
    ok: true,
    preserved: localTemplates.length,
    total: Object.values(templates).flat().length,
  };
}
