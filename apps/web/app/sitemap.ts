import { MetadataRoute } from "next";
import { getAllTemplates, getAllAuthors } from "@/lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://scaffoldor.vercel.app";

  const templates = getAllTemplates();
  const authors = getAllAuthors();

  const templateUrls = templates.map((template) => ({
    url: `${baseUrl}/templates/${template._username}/${template.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const authorUrls = authors.map((author) => ({
    url: `${baseUrl}/templates/${author}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...templateUrls,
    ...authorUrls,
  ];
}
