/**
 * Static data for the Registry Schema Viewer
 * Defines the documentation fields and example templates
 */

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
  options?: string[];
}

export const schemaFields: SchemaField[] = [
  {
    name: "slug",
    type: "string",
    required: true,
    description:
      "Unique identifier for CLI usage. Must be lowercase alphanumeric with hyphens only.",
    example: "my-awesome-template",
  },
  {
    name: "name",
    type: "string",
    required: true,
    description: "Human-readable display name for the template.",
    example: "My Awesome Template",
  },
  {
    name: "url",
    type: "string (URL)",
    required: true,
    description:
      "Full Git repository URL. Can point to a specific subdirectory.",
    example: "https://github.com/username/repo/tree/main/template",
  },
  {
    name: "platform",
    type: "enum",
    required: false,
    description: "Source platform for the template.",
    options: ["github", "gitlab", "custom"],
  },
  {
    name: "type",
    type: "enum",
    required: true,
    description: "Category/type of the template.",
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
  },
  {
    name: "description",
    type: "string",
    required: false,
    description: "Short description of what the template provides.",
    example: "A production-ready Next.js starter with authentication",
  },
  {
    name: "tags",
    type: "string[]",
    required: false,
    description: "Searchable tags for discovery.",
    example: '["typescript", "tailwind", "prisma"]',
  },
  {
    name: "features",
    type: "string[]",
    required: false,
    description: "List of features included in the template.",
    example: '["Authentication", "Database", "API Routes"]',
  },
  {
    name: "author",
    type: "object",
    required: true,
    description:
      "Author information object with 'name' (required), 'github' (optional), and 'url' (optional).",
    example: '{ "name": "John Doe", "github": "johndoe" }',
  },
  {
    name: "tier",
    type: "enum",
    required: false,
    description: "Pricing tier for the template.",
    options: ["free", "premium"],
  },
  {
    name: "pricing",
    type: "object",
    required: false,
    description:
      "Pricing details for premium templates. Includes 'amount', 'currency' (default USD), and optional 'purchaseUrl'.",
    example:
      '{ "amount": 29, "currency": "USD", "purchaseUrl": "https://..." }',
  },
  {
    name: "license",
    type: "string",
    required: false,
    description: "License identifier for the template.",
    example: "MIT",
  },
];

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
      features: ["App Router", "TypeScript", "ESLint", "Prettier"],
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
