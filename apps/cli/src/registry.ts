import fs from "fs-extra";
import path from "node:path";
import { RegistrySchema, Registry, Template } from "./types";

const REGISTRY_PATH = path.join(process.cwd(), "registry.json");

export async function readRegistry(): Promise<Registry> {
  if (!(await fs.pathExists(REGISTRY_PATH))) {
    return { templates: [] };
  }
  const data = await fs.readJson(REGISTRY_PATH);
  return RegistrySchema.parse(data);
}

export async function writeRegistry(registry: Registry): Promise<void> {
  await fs.writeJson(REGISTRY_PATH, registry, { spaces: 2 });
}

export async function findTemplateBySlug(
  slug: string
): Promise<Template | undefined> {
  const registry = await readRegistry();
  return registry.templates.find((t: Template) => t.slug === slug);
}

export async function addTemplateToRegistry(template: Template): Promise<void> {
  const registry = await readRegistry();
  const existingIndex = registry.templates.findIndex(
    (t: Template) => t.slug === template.slug
  );
  if (existingIndex !== -1) {
    registry.templates[existingIndex] = template;
  } else {
    registry.templates.push(template);
  }
  await writeRegistry(registry);
}
