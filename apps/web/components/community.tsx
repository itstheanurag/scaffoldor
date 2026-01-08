"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCodeBranch, FaBookOpen } from "react-icons/fa";
import { SchemaViewerModal } from "./schema-viewer-modal";
import { CONTENT_LINKS } from "@/lib/link";

export function Community() {
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  return (
    <>
      <section className="container py-12 md:py-24 lg:py-32 max-w-7xl mx-auto">
        <div className="flex max-auto flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-balance">
            Open Source & Community Driven
          </h2>
          <p className="max-w-[85%] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
            Anyone can register templates via a public registry schema.
            Contributions are reviewed, not gated. The project belongs to the
            community.
          </p>
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-800 px-8 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              <FaBookOpen className="mr-2 h-4 w-4" />
              View Registry Schema
            </button>
            <Link
              href={CONTENT_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-800 bg-transparent px-8 text-sm font-medium transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <FaCodeBranch className="mr-2 h-4 w-4" />
              Contribute a Template
            </Link>
          </div>
        </div>
      </section>

      <SchemaViewerModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />
    </>
  );
}
