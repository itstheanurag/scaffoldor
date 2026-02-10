import { getTemplateBySlug, getAllTemplates } from "@/lib/registry";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { BsArrowLeft, BsGithub, BsBoxArrowUpRight, BsTag } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

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

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { author, slug } = await params;
  const template = getTemplateBySlug(`${author}/${slug}`);

  if (!template) {
    return {
      title: "Template Not Found | Scaffoldor",
    };
  }

  const title = `${template.name} | ${template.framework} Template by ${template.author.name}`;
  const description = template.description || `Download the ${template.name} template for ${template.framework}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Scaffoldor",
      images: [
        {
          url: "/scaffoldor.png",
          width: 1200,
          height: 630,
          alt: template.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: template.name,
        description: template.description,
        programmingLanguage: template.framework,
        author: {
          "@type": "Person",
          name: template.author.name,
        },
        codeRepository: template.url,
        license: template.license,
        keywords: template.tags.join(", "),
      }),
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Top Header */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Link
          href="/templates"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all border border-neutral-800"
        >
          <BsArrowLeft className="text-lg" />
          <span>All Templates</span>
        </Link>

        <h4 className="text-lg md:text-xl font-semibold text-neutral-300 tracking-tight">
          Template Details
        </h4>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Author */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {template.name}
                </h1>
                <Badge variant="secondary" className="capitalize">
                  {template.type}
                </Badge>
                <Badge variant="outline" className="capitalize text-neutral-400 border-neutral-700">
                  {template.framework}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-neutral-400">
                <span>by</span>
                <Link
                  href={`https://github.com/${author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <span className="font-medium">{template.author.name}</span>
                  {template.author.github && (
                    <>
                      <BsGithub className="text-sm" />
                      <span>({author})</span>
                    </>
                  )}
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-neutral-300 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700"
                >
                  <BsTag className="text-xs" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Features */}
            {template.features && template.features.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {template.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-neutral-300"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            {/* Actions Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-white">Get Started</h3>

              <Button
                asChild
                className="w-full"
                size="lg"
              >
                <a
                  href={template.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <BsGithub className="text-xl" />
                  <span>View on {template.platform}</span>
                  <BsBoxArrowUpRight className="text-sm" />
                </a>
              </Button>

              <div className="text-center text-sm text-neutral-400">
                or run
              </div>

              <div className="bg-neutral-950 rounded-lg p-3 font-mono text-sm">
                <code className="text-green-400">npx scaffoldor add {templateFullSlug}</code>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-white">Details</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">License</span>
                  <span className="text-white">{template.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Tier</span>
                  <span className="text-green-400 capitalize">{template.tier}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
