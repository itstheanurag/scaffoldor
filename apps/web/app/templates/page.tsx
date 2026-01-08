import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TemplateSearch } from "@/components/templates/template-search";
import { getAllTemplates } from "@/lib/registry";

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <main className="flex-1 w-full pt-36">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-300 dark:text-neutral-200 mb-4">
              Explore Templates
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Discover production-ready templates from the community. Start your
              next project with best practices built-in.
            </p>
          </div>

          {/* Search & Grid */}
          <TemplateSearch initialTemplates={templates} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
