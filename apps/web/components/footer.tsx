"use client"
import { useState } from "react";
import { CONTENT_LINKS } from "@/lib/link";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { SchemaViewerModal } from "./schema-viewer-modal";

export function Footer() {
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);

  return (
    <>
      <footer className="w-full border-t border-neutral-800 bg-neutral-950/20 py-6 md:py-0">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
            Built by the community. Licensed under MIT.
          </p>

          <nav className="flex gap-4 sm:gap-6">
            <Link
              href={CONTENT_LINKS.CLI_INSTALL}
              className="text-sm font-medium text-gray-400 hover:text-white hover:underline underline-offset-4"
            >
              CLI Install
            </Link>

            {/* 👇 Modal trigger */}
            <button
              onClick={() => setIsSchemaOpen(true)}
              className="text-sm font-medium text-gray-400 hover:text-white hover:underline underline-offset-4"
            >
              Registry Schema
            </button>

            <Link
              href={CONTENT_LINKS.GITHUB}
              className="text-sm font-medium text-gray-400 hover:text-white hover:underline underline-offset-4"
            >
              <FaGithub className="inline-block h-4 w-4" /> GitHub
            </Link>
          </nav>
        </div>
      </footer>
      {isSchemaOpen && (
        <SchemaViewerModal
          isOpen={isSchemaOpen}
          onClose={() => setIsSchemaOpen(false)}
        />
      )}
    </>
  );
}
