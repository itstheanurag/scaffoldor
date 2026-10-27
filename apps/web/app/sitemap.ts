import { MetadataRoute } from "next";
import { getAllTemplates, getAllAuthors, registry } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const templates = getAllTemplates();
  const authors = getAllAuthors();

  // Use the registry timestamp so unchanged registries produce a stable sitemap.
  const lastModified = new Date(registry.lastUpdated);
  const lastModifiedDate = Number.isNaN(lastModified.getTime())
    ? new Date()
    : lastModified;

  const templateUrls = templates.map((template) => ({
    url: `${SITE_URL}/templates/${template._username}/${template.slug}`,
    lastModified: lastModifiedDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const authorUrls = authors.map((author) => ({
    url: `${SITE_URL}/templates/${author}`,
    lastModified: lastModifiedDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: lastModifiedDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/templates`,
      lastModified: lastModifiedDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...authorUrls,
    ...templateUrls,
  ];
}
