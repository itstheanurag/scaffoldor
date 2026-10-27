import { FrameworkSchema, TemplateTypeSchema } from "@repo/schema";
import { CliError } from "./errors";

type EnumSchema = {
  safeParse: (
    value: unknown,
  ) => { success: true; data: string } | { success: false };
  options: readonly string[];
};

function normalizeEnum(
  value: string | undefined,
  schema: EnumSchema,
  label: string,
): string | undefined {
  if (value === undefined) return undefined;

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    throw new CliError(`--${label} requires a value.`);
  }

  const result = schema.safeParse(normalized);
  if (!result.success) {
    throw new CliError(
      `Invalid ${label} "${value}".\nValid values: ${schema.options.join(", ")}.`,
    );
  }

  return result.data;
}

export function normalizeType(value?: string): string | undefined {
  return normalizeEnum(value, TemplateTypeSchema, "type");
}

export function normalizeFramework(value?: string): string | undefined {
  return normalizeEnum(value, FrameworkSchema, "framework");
}

export function normalizeAuthor(value?: string): string | undefined {
  if (value === undefined) return undefined;

  const author = value.trim().replace(/^@/, "");
  if (!author) {
    throw new CliError("--author requires a username.");
  }

  return author;
}

/**
 * Parse a comma-separated option value, trimming entries and removing
 * duplicates. Quoted values such as --tags "auth, db" work as expected.
 */
export function parseCommaSeparated(value?: string): string[] {
  if (!value) return [];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const entry of value.split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) continue;

    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}
