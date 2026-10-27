/**
 * Canonical site metadata. Override the public URL per environment with
 * NEXT_PUBLIC_SITE_URL (for example on a custom domain).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://scaffoldor.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Scaffoldor";

export const SITE_TITLE = "Scaffoldor — Production-ready project templates";

export const SITE_DESCRIPTION =
  "Discover and scaffold production-ready project templates from GitHub and GitLab. Browse by framework, copy one command, and start with a clean project.";

export const SITE_KEYWORDS = [
  "scaffoldor",
  "project templates",
  "scaffolding",
  "boilerplate",
  "starter kit",
  "github templates",
  "gitlab templates",
  "nextjs template",
  "typescript starter",
  "cli scaffolding",
];

export const SOCIAL_IMAGE = {
  url: "/scaffoldor.png",
  width: 1200,
  height: 630,
  alt: "Scaffoldor — production-ready project templates",
};

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
