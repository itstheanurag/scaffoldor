import type { Metadata } from "next";
import { TemplateSearch } from "@/components/templates/template-search";
import { getAllTemplates } from "@/lib/registry";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { CONTENT_LINKS } from "@/lib/link";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE,
} from "@/lib/site";
import Link from "next/link";
import { BsArrowRight, BsGithub } from "react-icons/bs";

interface TemplatesPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Browse project templates",
  description:
    "Browse production-ready starter templates from the community. Filter by framework, type, and stack, then scaffold with a single command.",
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    title: "Browse project templates",
    description:
      "Browse production-ready starter templates from the community. Filter by framework, type, and stack.",
    url: "/templates",
    siteName: SITE_NAME,
    images: [SOCIAL_IMAGE],
  },
};

export default async function TemplatesPage({
  searchParams,
}: TemplatesPageProps) {
  const { q } = await searchParams;
  const templates = getAllTemplates();

  const frameworkCount = new Set(
    templates.map((template) => template.framework).filter(Boolean),
  ).size;
  const authorCount = new Set(templates.map((template) => template._username))
    .size;

  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Scaffoldor template registry",
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/templates`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: templates.length,
      itemListElement: templates.slice(0, 25).map((template, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: template.name,
        url: `${SITE_URL}/templates/${template._username}/${template.slug}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <JsonLd data={collectionData} />
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full text-neutral-800/70"
          >
            <defs>
              <pattern
                id="template-hero-dots"
                width="26"
                height="26"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#template-hero-dots)" />
          </svg>

          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 md:pb-20 md:pt-24 lg:px-8">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Template registry
              <span className="h-px w-10 bg-neutral-800" />
              {templates.length} indexed
            </div>

            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-300 sm:text-5xl md:text-6xl">
              Start from something{" "}
              <span className="text-emerald-300/80">solid.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-neutral-400 md:text-lg">
              A curated registry of community-built starters for web, backend,
              mobile, and CLI projects. Inspect the stack, copy one command, and
              make it yours.
            </p>

            <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Stat label="Templates" value={templates.length} />
              <Stat label="Stacks" value={frameworkCount} />
              <Stat label="Contributors" value={authorCount} />
              <div className="hidden h-8 w-px bg-neutral-800 sm:block" />
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/40 px-3 py-2 font-mono text-xs text-neutral-400">
                <span className="text-emerald-400">$</span>
                <span>npx scaffoldor list --remote</span>
              </div>
            </dl>
          </div>
        </section>

        {/* Catalog */}
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pt-10 lg:px-8">
          <TemplateSearch
            initialTemplates={templates}
            initialQuery={typeof q === "string" ? q : ""}
          />
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-neutral-900/50 px-6 py-10 md:px-10 md:py-12">
            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  Open source by default
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-300 md:text-3xl">
                  Built something worth sharing?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  Add your starter to the registry with a pull request. If it
                  helps someone ship faster, it belongs here.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`${CONTENT_LINKS.GITHUB}/blob/main/content/templates/CONTRIBUTING.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-300"
                >
                  <BsGithub />
                  Submit a template
                  <BsArrowRight />
                </Link>
                <Link
                  href={CONTENT_LINKS.CLI_INSTALL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-100"
                >
                  CLI docs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="order-2 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </dt>
      <dd className="order-1 text-xl font-semibold tabular-nums text-neutral-200">
        {value}
      </dd>
    </div>
  );
}
