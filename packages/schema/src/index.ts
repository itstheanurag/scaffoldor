import { z } from "zod";

/**
 * Template pricing tiers - "free" for community, "premium" for paid (future)
 */
export const TemplateTierSchema = z.enum(["free", "premium"]);

/**
 * Source platform for templates
 */
export const SourcePlatformSchema = z.enum(["github", "gitlab", "custom"]);

/**
 * Template categories
 */
export const TemplateTypeSchema = z.enum([
  "frontend",
  "backend",
  "fullstack",
  "mobile",
  "cli",
  "library",
  "other",
]);

/**
 * Framework identifiers
 */
export const FrameworkSchema = z.enum([
  // Frontend
  "react",
  "vue",
  "svelte",
  "angular",
  "nextjs",
  "nuxt",
  "astro",
  "solid",
  "qwik",
  // Backend
  "express",
  "fastify",
  "hono",
  "elysia",
  "nestjs",
  "koa",
  // Fullstack
  "remix",
  "sveltekit",
  // Mobile
  "react-native",
  "expo",
  "flutter",
  // Other
  "none",
  "other",
]);

/**
 * Pricing info for premium templates (future use)
 */
export const PricingSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  purchaseUrl: z.string().url().optional(),
});

/**
 * Author information
 */
export const AuthorSchema = z.object({
  name: z.string().min(1),
  github: z.string().optional(),
  url: z.string().url().optional(),
});

/**
 * Community template schema with all fields
 * This is the source of truth for template structure
 */
export const CommunityTemplateSchema = z.object({
  /** Unique slug for CLI usage (e.g., "nextjs-starter") */
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),

  /** Human-readable name */
  name: z.string().min(1),

  /** Git repository URL */
  url: z.string().url(),

  /** Source platform (github, gitlab, custom) */
  platform: SourcePlatformSchema.default("github"),

  /** Template type/category */
  type: TemplateTypeSchema,

  /** Primary framework */
  framework: FrameworkSchema.default("other"),

  /** Short description */
  description: z.string().optional(),

  /** Searchable tags */
  tags: z.array(z.string()).default([]),

  /** Feature list for display */
  features: z.array(z.string()).default([]),

  /** Template author */
  author: AuthorSchema,

  /** Pricing tier */
  tier: TemplateTierSchema.default("free"),

  /** Pricing details (only for premium tier) */
  pricing: PricingSchema.optional(),

  /** License identifier */
  license: z.string().default("MIT"),
});

/**
 * Full registry schema - templates grouped by author
 * Structure: { templates: { "username": [...templates] } }
 */
export const RegistrySchema = z.object({
  version: z.string().default("1.0.0"),
  lastUpdated: z.string().datetime(),
  templates: z.record(z.string(), z.array(CommunityTemplateSchema)),
});

/**
 * User templates file schema (content/templates/{user}/index.json)
 */
export const UserTemplatesSchema = z.object({
  templates: z.array(CommunityTemplateSchema),
});

export type TemplateTier = z.infer<typeof TemplateTierSchema>;
export type SourcePlatform = z.infer<typeof SourcePlatformSchema>;
export type TemplateType = z.infer<typeof TemplateTypeSchema>;
export type Framework = z.infer<typeof FrameworkSchema>;
export type Pricing = z.infer<typeof PricingSchema>;
export type Author = z.infer<typeof AuthorSchema>;
export type CommunityTemplate = z.infer<typeof CommunityTemplateSchema>;
export type Registry = z.infer<typeof RegistrySchema>;
export type UserTemplates = z.infer<typeof UserTemplatesSchema>;
