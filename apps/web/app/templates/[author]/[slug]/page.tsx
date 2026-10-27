import {
  getTemplateBySlug,
  getAllTemplates,
  getDisplayTags,
} from "@/lib/registry";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  BsArrowLeft,
  BsBoxArrowUpRight,
  BsGithub,
  BsTag,
} from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { JsonLd } from "@/components/json-ld";
import { CopyCommand } from "@/components/copy-command";
import { SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "@/lib/site";
import { formatFramework, formatLabel, toTitleCase } from "@/lib/format";

interface TemplatePageProps {
  params: Promise<{
    author: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((template) => ({
    author: template._username,
    slug: template.slug,
  }));
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  const { author, slug } = await params;
  const template = getTemplateBySlug(`${author}/${slug}`);

  if (!template) {
    return {
      title: "Template not found",
    };
  }

  const title = `${toTitleCase(template.name)} — ${formatFramework(template.framework)} template`;
  const description =
    template.description ||
    `Scaffold the ${toTitleCase(template.name)} template by ${template.author.name} with one command.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/templates/${author}/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/templates/${author}/${slug}`,
      type: "article",
      siteName: SITE_NAME,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { author, slug } = await params;
  const template = getTemplateBySlug(`${author}/${slug}`);

  if (!template) {
    notFound();
  }

  const templateFullSlug = `@${author}/${slug}`;
  const scaffoldCommand = `npx scaffoldor ${templateFullSlug}`;
  const githubHandle = template.author.github || author;
  const authorUrl = `https://github.com/${githubHandle}`;
  const displayTags = getDisplayTags(template);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: template.name,
    description: template.description,
    url: `${SITE_URL}/templates/${author}/${slug}`,
    codeRepository: template.url,
    programmingLanguage: template.framework,
    license: template.license,
    keywords: template.tags.join(", "),
    author: {
      "@type": "Person",
      name: template.author.name,
      url: authorUrl,
    },
    isPartOf: {
      "@type": "CollectionPage",
      name: "Scaffoldor template registry",
      url: `${SITE_URL}/templates`,
    },
  };

  const details = [
    { label: "Framework", value: formatFramework(template.framework) },
    { label: "Category", value: formatLabel(template.type) },
    { label: "License", value: template.license },
    { label: "Tier", value: template.tier === "free" ? "Free" : "Premium" },
    { label: "Source", value: formatLabel(template.platform) },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <JsonLd data={structuredData} />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 md:pt-32 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-neutral-500"
        >
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-100"
          >
            <BsArrowLeft className="text-xs" />
            All templates
          </Link>
          <span className="text-neutral-700">/</span>
          <Link
            href={`/templates/${author}`}
            className="transition-colors hover:text-neutral-100"
          >
            {template.author.name}
          </Link>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-300">{toTitleCase(template.name)}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main content */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
              >
                {formatLabel(template.type)}
              </Badge>
              <Badge
                variant="outline"
                className="border-neutral-800 bg-neutral-900 text-neutral-300"
              >
                {formatFramework(template.framework)}
              </Badge>
              {template.tier === "premium" && (
                <Badge className="border border-amber-400/20 bg-amber-400/10 text-amber-300">
                  Premium
                </Badge>
              )}
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-300 md:text-5xl">
              {toTitleCase(template.name)}
            </h1>

            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-400">
              {template.description || "No description provided yet."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">
              <Link
                href={authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-neutral-300 transition-colors hover:text-neutral-100"
              >
                <BsGithub />
                {template.author.name}
                <span className="text-neutral-500">@{author}</span>
              </Link>
              <a
                href={template.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-200"
              >
                View source
                <BsBoxArrowUpRight className="text-xs" />
              </a>
              <span>{template.license} licensed</span>
            </div>

            {template.features.length > 0 && (
              <section className="mt-12 border-t border-white/[0.07] pt-8">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  What&apos;s included
                </h2>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {template.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-neutral-900/40 px-3.5 py-3 text-sm text-neutral-300"
                    >
                      <FaCheck className="shrink-0 text-xs text-emerald-400" />
                      {formatLabel(feature)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {displayTags.length > 0 && (
              <section className="mt-10 border-t border-white/[0.07] pt-8">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Tags
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {displayTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-sm text-neutral-400"
                    >
                      <BsTag className="text-[10px] text-neutral-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-10 border-t border-white/[0.07] pt-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                How it works
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400">
                Scaffoldor clones the repository into a temporary directory,
                strips the original git history, applies your package manager
                choice, and moves the result into your destination. Nothing is
                written until the command succeeds.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/50 p-5">
              <h2 className="text-sm font-semibold text-neutral-200">
                Get started
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Run this in the directory where the project should live.
              </p>

              <div className="mt-4">
                <CopyCommand command={scaffoldCommand} label="Copy" />
              </div>

              <Button
                asChild
                variant="secondary-action"
                className="mt-3 w-full"
              >
                <a
                  href={template.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <BsGithub />
                  Open {formatLabel(template.platform)} repository
                  <BsBoxArrowUpRight className="text-xs" />
                </a>
              </Button>

              <p className="mt-4 border-t border-white/[0.06] pt-4 text-xs leading-relaxed text-neutral-500">
                Add{" "}
                <code className="rounded bg-black/60 px-1 py-0.5 font-mono text-[11px] text-neutral-400">
                  --git fresh --pm pnpm --yes
                </code>{" "}
                to skip prompts and pick a setup.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/50 p-5">
              <h2 className="text-sm font-semibold text-neutral-200">
                Details
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-neutral-500">{item.label}</dt>
                    <dd className="text-right font-medium text-neutral-200">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
