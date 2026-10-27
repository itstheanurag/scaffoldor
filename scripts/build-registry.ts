#!/usr/bin/env bun
/**
 * Build script that compiles user template files into registry.json
 *
 * Structure: content/templates/{username}/index.json -> { templates: [...] }
 * Output: { templates: { "username": [...templates] } }
 * Usage: bun run scripts/build-registry.ts
 */

import {
  UserTemplatesSchema,
  RegistrySchema,
  type CommunityTemplate,
} from "../packages/schema/src/index";

const CONTENT_DIR = `${import.meta.dir}/../content/templates`;
const OUTPUT_FILE = `${import.meta.dir}/../registry/registry.json`;

async function getUserDirs(): Promise<string[]> {
  const glob = new Bun.Glob("*/");
  const dirs: string[] = [];
  for await (const dir of glob.scan({ cwd: CONTENT_DIR, onlyFiles: false })) {
    dirs.push(dir.replace("/", ""));
  }
  // Keep registry key order deterministic between builds.
  return dirs.sort();
}

async function loadUserTemplates(
  username: string,
): Promise<CommunityTemplate[]> {
  const filePath = `${CONTENT_DIR}/${username}/index.json`;
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    console.warn(`  ⚠ No index.json found for @${username}, skipping`);
    return [];
  }

  const data = await file.json();
  const result = UserTemplatesSchema.safeParse(data);

  if (!result.success) {
    console.error(`Validation failed for @${username}/index.json:`);
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error(`Invalid templates file: @${username}/index.json`);
  }

  return result.data.templates;
}

async function buildRegistry(): Promise<void> {
  console.log("Building registry...\n");

  const userDirs = await getUserDirs();
  console.log(`Found ${userDirs.length} user(s)\n`);

  // Templates grouped by author
  const templatesByAuthor: Record<string, CommunityTemplate[]> = {};

  for (const username of userDirs) {
    const templates = await loadUserTemplates(username);

    if (templates.length > 0) {
      // Normalize free-form lists so downstream consumers do not render
      // duplicate tags/features or duplicate React keys.
      for (const template of templates) {
        template.tags = [...new Set(template.tags)];
        template.features = [...new Set(template.features)];
      }

      // Sort templates by slug within each author
      templates.sort((a, b) => a.slug.localeCompare(b.slug));

      const seenSlugs = new Set<string>();
      for (const template of templates) {
        if (seenSlugs.has(template.slug)) {
          throw new Error(
            `Duplicate template slug "@${username}/${template.slug}"`,
          );
        }
        seenSlugs.add(template.slug);
      }

      templatesByAuthor[username] = templates;

      for (const template of templates) {
        console.log(`  ✓ @${username}/${template.slug}`);
      }
    }
  }

  // Keep lastUpdated stable when the template data did not change, so the
  // sitemap does not report a new modification date on every build.
  let lastUpdated = new Date().toISOString();
  const outputFile = Bun.file(OUTPUT_FILE);
  if (await outputFile.exists()) {
    try {
      const existing = (await outputFile.json()) as {
        lastUpdated?: string;
        templates?: unknown;
      };
      if (
        existing.lastUpdated &&
        JSON.stringify(existing.templates) === JSON.stringify(templatesByAuthor)
      ) {
        lastUpdated = existing.lastUpdated;
      }
    } catch {
      // A corrupt existing registry should not block a rebuild.
    }
  }

  const registry = {
    version: "1.0.0",
    lastUpdated,
    templates: templatesByAuthor,
  };

  // Validate full registry
  const registryResult = RegistrySchema.safeParse(registry);
  if (!registryResult.success) {
    console.error("\nRegistry validation failed:");
    console.error(JSON.stringify(registryResult.error.format(), null, 2));
    throw new Error("Registry validation failed");
  }

  // Write output
  await Bun.write(OUTPUT_FILE, JSON.stringify(registry, null, 2) + "\n");

  const totalTemplates = Object.values(templatesByAuthor).flat().length;
  console.log("\nRegistry built successfully!");
  console.log(`  Output: ${OUTPUT_FILE}`);
  console.log(`  Authors: ${Object.keys(templatesByAuthor).length}`);
  console.log(`  Templates: ${totalTemplates}`);
}

buildRegistry().catch((error) => {
  console.error("\n❌ Build failed:", error.message);
  process.exit(1);
});
