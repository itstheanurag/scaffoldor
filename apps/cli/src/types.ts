import { CommunityTemplate } from "@repo/schema";

/**
 * Re-export schema types from @repo/schema
 */
export * from "@repo/schema";

/**
 * Extended template type that includes the registry username key
 * This is used after flattening to preserve which user the template belongs to
 */
export type TemplateWithUsername = CommunityTemplate & {
  username: string;
};
