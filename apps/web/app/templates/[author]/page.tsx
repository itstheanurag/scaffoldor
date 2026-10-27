import { getAuthorTemplates, getAllAuthors } from "@/lib/registry";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { BsArrowLeft, BsGithub, BsArrowUpRight } from "react-icons/bs";
import { TemplateCard } from "@/components/templates/template-card";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";

interface AuthorPageProps {
  params: Promise<{
    author: string;
  }>;
}

export async function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((author) => ({ author }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { author } = await params;
  const templates = getAuthorTemplates(author);

  if (templates.length === 0) {
    return {
      title: "Author not found",
    };
  }

  const authorName = templates[0]?.author?.name || author;
  const description = `Browse ${templates.length} production-ready template${
    templates.length === 1 ? "" : "s"
  } published by ${authorName} on Scaffoldor.`;

  return {
    title: `${authorName}'s templates`,
    description,
    alternates: {
      canonical: `/templates/${author}`,
    },
    openGraph: {
      title: `${authorName}'s templates`,
      description,
      url: `/templates/${author}`,
      type: "profile",
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author } = await params;
  const templates = getAuthorTemplates(author);

  if (templates.length === 0) {
    notFound();
  }

  const authorName = templates[0]?.author?.name || author;
  const githubHandle = templates[0]?.author?.github || author;
  const githubUrl = `https://github.com/${githubHandle}`;
  const initial = authorName.charAt(0).toUpperCase();

  const profileData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE_URL}/templates/${author}`,
    mainEntity: {
      "@type": "Person",
      name: authorName,
      alternateName: `@${author}`,
      url: githubUrl,
    },
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <JsonLd data={profileData} />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 md:pt-32 lg:px-8">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-100"
        >
          <BsArrowLeft />
          All templates
        </Link>

        <header className="mt-8 flex flex-col gap-6 border-b border-white/[0.07] pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] text-2xl font-semibold text-emerald-300">
              {initial}
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Contributor
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-300 md:text-4xl">
                {authorName}
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                @{author} · {templates.length} template
                {templates.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-100"
          >
            <BsGithub />
            View on GitHub
            <BsArrowUpRight className="text-xs text-neutral-500" />
          </a>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template, index) => (
            <TemplateCard
              key={template.slug}
              index={index}
              template={{
                ...template,
                _username: author,
              }}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
