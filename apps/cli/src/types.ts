import { z } from "zod";

export const TemplateSchema = z.object({
  slug: z.string(),
  type: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
});

export const RegistrySchema = z.object({
  templates: z.array(TemplateSchema),
});

export type Template = z.infer<typeof TemplateSchema>;
export type Registry = z.infer<typeof RegistrySchema>;
