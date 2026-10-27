/**
 * Static data for the Registry Schema Viewer
 * Defines the documentation fields and example templates
 */

export type SchemaGroupId =
  | "core"
  | "presentation"
  | "ownership"
  | "publishing";

export interface SchemaGroup {
  id: SchemaGroupId;
  label: string;
  description: string;
}

export interface SchemaField {
  name: string;
  type: string;
  group: SchemaGroupId;
  required: boolean;
  description: string;
  example?: string;
  options?: string[];
  defaultValue?: string;
  constraint?: string;
}

export const schemaGroups: SchemaGroup[] = [
  {
    id: "core",
    label: "Core",
    description: "Identity, source, and how the template is classified.",
  },
  {
    id: "presentation",
    label: "Presentation",
    description: "The copy and metadata shown in the directory.",
  },
  {
    id: "ownership",
    label: "Ownership",
    description: "Who gets credit for the template.",
  },
  {
    id: "publishing",
    label: "Publishing",
    description: "Licensing and optional premium settings.",
  },
];

export const schemaFields: SchemaField[] = [
  {
    name: "slug",
    type: "string",
    group: "core",
    required: true,
    description:
      "Unique identifier for CLI usage. It is the last segment of the scaffold command.",
    constraint: "lowercase letters, numbers, and hyphens only",
    example: "my-awesome-template",
  },
  {
    name: "name",
    type: "string",
    group: "core",
    required: true,
    description: "Human-readable display name for the template.",
    example: "My Awesome Template",
  },
  {
    name: "url",
    type: "string (URL)",
    group: "core",
    required: true,
    description:
      "Full Git repository URL. It can point at a branch or a subdirectory inside the repository.",
    constraint: "HTTPS, SSH, or file URL",
    example: "https://github.com/username/repo/tree/main/template",
  },
  {
    name: "platform",
    type: "enum",
    group: "core",
    required: false,
    description: "Source platform for the template.",
    options: ["github", "gitlab", "custom"],
    defaultValue: "github",
  },
  {
    name: "type",
    type: "enum",
    group: "core",
    required: true,
    description: "Category used for filtering in the CLI and directory.",
    options: [
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "cli",
      "library",
      "other",
    ],
  },
  {
    name: "framework",
    type: "enum",
    group: "core",
    required: false,
    description: "Primary framework used in the template.",
    options: [
      "react",
      "vue",
      "svelte",
      "angular",
      "nextjs",
      "nuxt",
      "astro",
      "solid",
      "qwik",
      "express",
      "fastify",
      "hono",
      "elysia",
      "nestjs",
      "koa",
      "remix",
      "sveltekit",
      "react-native",
      "expo",
      "flutter",
      "none",
      "other",
    ],
    defaultValue: "other",
  },
  {
    name: "description",
    type: "string",
    group: "presentation",
    required: false,
    description: "Short description of what the template provides.",
    example: "A production-ready Next.js starter with authentication",
  },
  {
    name: "tags",
    type: "string[]",
    group: "presentation",
    required: false,
    description: "Searchable tags used by the CLI and directory search.",
    example: '["typescript", "tailwind", "prisma"]',
    defaultValue: "[]",
  },
  {
    name: "features",
    type: "string[]",
    group: "presentation",
    required: false,
    description: "Feature list rendered on the template detail page.",
    example: '["auth", "database", "api-routes"]',
    defaultValue: "[]",
  },
  {
    name: "author",
    type: "object",
    group: "ownership",
    required: true,
    description:
      "Author information. Only name is required; github and url are optional.",
    constraint: "name required · github and url optional",
    example: '{ "name": "John Doe", "github": "johndoe" }',
  },
  {
    name: "tier",
    type: "enum",
    group: "publishing",
    required: false,
    description: "Pricing tier for the template.",
    options: ["free", "premium"],
    defaultValue: "free",
  },
  {
    name: "pricing",
    type: "object",
    group: "publishing",
    required: false,
    description:
      "Pricing details for premium templates. Includes amount, currency, and an optional purchase URL.",
    constraint: "required when tier is premium",
    example:
      '{ "amount": 29, "currency": "USD", "purchaseUrl": "https://..." }',
  },
  {
    name: "license",
    type: "string",
    group: "publishing",
    required: false,
    description: "License identifier for the template.",
    example: "MIT",
    defaultValue: "MIT",
  },
];

export const schemaStats = {
  total: schemaFields.length,
  required: schemaFields.filter((field) => field.required).length,
  optional: schemaFields.filter((field) => !field.required).length,
  groups: schemaGroups.length,
};

export const exampleFile = {
  templates: [
    {
      slug: "my-nextjs-starter",
      name: "My Next.js Starter",
      url: "https://github.com/username/nextjs-starter",
      platform: "github",
      type: "fullstack",
      framework: "nextjs",
      description: "A production-ready Next.js starter template",
      tags: ["nextjs", "react", "typescript", "tailwind"],
      features: ["app-router", "typescript", "eslint", "prettier"],
      author: {
        name: "Your Name",
        github: "yourusername",
        url: "https://yourwebsite.com",
      },
      tier: "free",
      license: "MIT",
    },
  ],
};

/**
 * A shorter example used in the landing-page preview. Keeping it separate from
 * the full example file avoids a wall of JSON above the fold.
 */
export const examplePreview = {
  templates: [
    {
      slug: "my-nextjs-starter",
      name: "My Next.js Starter",
      url: "https://github.com/you/nextjs-starter",
      type: "fullstack",
      framework: "nextjs",
      author: { name: "Your Name", github: "you" },
    },
  ],
};
