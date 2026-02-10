import { getAuthorTemplates, getAllAuthors } from "@/lib/registry";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { BsArrowLeft, BsGithub, BsBoxArrowUpRight } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/templates/template-card";
import { Footer } from "@/components/footer";

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
      title: "Author Not Found | Scaffoldor",
    };
  }

  const authorName = templates[0]?.author?.name || author;

  return {
    title: `${authorName}'s Templates | Scaffoldor`,
    description: `Browse ${templates.length} production-ready templates by ${authorName}. Find the perfect starting point for your next project.`,
    openGraph: {
      title: `${authorName}'s Templates | Scaffoldor`,
      description: `Browse ${templates.length} production-ready templates by ${authorName}. Find the perfect starting point for your next project.`,
      type: "website",
      siteName: "Scaffoldor",
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

  return (
    <div className="flex h-screen flex-col bg-black overflow-hidden">
      {/* Fixed Top Header */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Link
          href="/templates"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all border border-neutral-800"
        >
          <BsArrowLeft className="text-lg" />
          <span>All Templates</span>
        </Link>

        <div className="flex items-center gap-2">
          <h4 className="text-lg md:text-xl font-semibold text-neutral-300 tracking-tight">
            {authorName}'s Templates
          </h4>
          <a
            href={`https://github.com/${author}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <BsGithub className="text-xl" />
          </a>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Author Stats */}
          <div className="mb-8">
            <p className="text-neutral-400">
              {templates.length} template{templates.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Link
                key={template.slug}
                href={`/templates/${author}/${template.slug}`}
                className="block"
              >
                <TemplateCard
                  template={{
                    ...template,
                    _username: author,
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
