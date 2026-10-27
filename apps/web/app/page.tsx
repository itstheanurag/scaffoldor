import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero/hero";
import { HowItWorks } from "@/components/how-it-works";
import { TemplatePreview } from "@/components/template-preview";
import { Community } from "@/components/community";
import { Footer } from "@/components/footer";
import { CliShowcase } from "@/components/showcase/showcase";
import { JsonLd } from "@/components/json-ld";
import { getAllTemplates } from "@/lib/registry";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_IMAGE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    images: [SOCIAL_IMAGE],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/templates?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "macOS, Linux, Windows",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function Home() {
  const templates = getAllTemplates();
  const frameworkCount = new Set(
    templates
      .map((template) => template.framework)
      .filter((framework) => framework !== "none"),
  ).size;
  const authorCount = new Set(templates.map((template) => template._username))
    .size;

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={structuredData} />
      <Navbar />
      <main className="w-full flex-1">
        <Hero
          templateCount={templates.length}
          frameworkCount={frameworkCount}
          authorCount={authorCount}
        />
        <HowItWorks />
        <CliShowcase />
        <TemplatePreview />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
