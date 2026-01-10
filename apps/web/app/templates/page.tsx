import { TemplateSearch } from "@/components/templates/template-search";
import { getAllTemplates } from "@/lib/registry";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div className="flex h-screen flex-col bg-black overflow-hidden">
      {/* Fixed Top Header */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all border border-neutral-800"
        >
          <BsArrowLeft className="text-lg" />
          <span>Go Back</span>
        </Link>

        <h4 className="text-lg md:text-xl font-semibold text-neutral-300 tracking-tight">
          Templates
        </h4>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TemplateSearch initialTemplates={templates} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
