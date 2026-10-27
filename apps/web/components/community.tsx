"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaCheck,
  FaCodeBranch,
  FaFileCode,
} from "react-icons/fa";
import { SchemaViewerModal } from "./schema-viewer-modal";
import { examplePreview, schemaFields, schemaStats } from "@/lib/schema-data";
import { CONTENT_LINKS } from "@/lib/link";

const previewJson = JSON.stringify(examplePreview, null, 2).split("\n");

export function Community() {
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);

  return (
    <>
      <section
        id="registry"
        className="relative overflow-hidden border-y border-neutral-800 bg-neutral-900/50 py-16 md:py-24"
      >
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full text-neutral-800/50"
        >
          <defs>
            <pattern
              id="registry-dots"
              width="26"
              height="26"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#registry-dots)" />
        </svg>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Copy */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              Open registry
            </p>
            <h2 className="mt-3 max-w-lg text-balance text-3xl font-bold tracking-tight text-neutral-200 md:text-4xl">
              A registry you can{" "}
              <span className="text-emerald-300/80">actually read.</span>
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-neutral-400">
              Every template is a small, validated JSON file in the repository.
              No database, no private API, and no gatekeeping — just a pull
              request and a schema anyone can inspect.
            </p>

            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-y border-neutral-800 py-5">
              <Stat value={schemaStats.total} label="Fields" />
              <Stat value={schemaStats.required} label="Required" />
              <Stat value={schemaStats.groups} label="Groups" />
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsSchemaOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-300"
              >
                Explore the schema
                <FaArrowRight className="text-xs" />
              </button>
              <Link
                href={`${CONTENT_LINKS.GITHUB}/blob/main/content/templates/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-100"
              >
                <FaCodeBranch className="text-xs" />
                Contribution guide
              </Link>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
              <FaCheck className="text-[10px] text-emerald-400/80" />
              Validated with Zod on every registry build
            </p>
          </div>

          {/* Schema preview */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900/50 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-neutral-500">
                  <FaFileCode className="shrink-0 text-emerald-400/80" />
                  <span className="truncate">
                    content/templates/you/index.json
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                  valid
                </span>
              </div>

              <div className="max-h-[330px] overflow-hidden py-3 font-mono text-[10.5px] leading-5 sm:text-[11px]">
                {previewJson.map((line, index) => (
                  <div key={index} className="flex px-4">
                    <span className="w-5 shrink-0 select-none pr-3 text-right text-neutral-700">
                      {index + 1}
                    </span>
                    <code className="whitespace-pre">
                      <JsonLine line={line} />
                    </code>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsSchemaOpen(true)}
                className="flex w-full items-center justify-between gap-3 border-t border-neutral-800 bg-neutral-900/30 px-4 py-3 text-left transition-colors hover:bg-neutral-900/60"
              >
                <span className="flex flex-wrap items-center gap-1.5">
                  {["slug", "type", "framework", "author"].map((field) => (
                    <span
                      key={field}
                      className="rounded-md border border-neutral-800 bg-neutral-950/60 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500"
                    >
                      {field}
                    </span>
                  ))}
                  <span className="px-1 text-[10px] text-neutral-600">
                    +{schemaFields.length - 4} more
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-neutral-400">
                  Open schema
                  <FaArrowRight className="text-[9px]" />
                </span>
              </button>
            </div>

            <p className="mt-3 text-center text-[11px] text-neutral-600">
              Example submission · read the full schema for every constraint
            </p>
          </div>
        </div>
      </section>

      <SchemaViewerModal
        isOpen={isSchemaOpen}
        onClose={() => setIsSchemaOpen(false)}
      />
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </dt>
      <dd className="text-2xl font-semibold tabular-nums text-neutral-200">
        {value}
      </dd>
    </div>
  );
}

function JsonLine({ line }: { line: string }) {
  const tokenPattern =
    /("(?:\\.|[^"\\])*")|(\btrue\b|\bfalse\b|\bnull\b)|(-?\d+(?:\.\d+)?)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`plain-${lastIndex}`} className="text-neutral-500">
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const token = match[0];
    const isKey = line
      .slice(match.index + token.length)
      .trimStart()
      .startsWith(":");

    if (token.startsWith('"')) {
      nodes.push(
        <span
          key={`token-${match.index}`}
          className={isKey ? "text-emerald-300/90" : "text-amber-200/70"}
        >
          {token}
        </span>,
      );
    } else {
      nodes.push(
        <span key={`token-${match.index}`} className="text-sky-300/70">
          {token}
        </span>,
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <span key={`tail-${lastIndex}`} className="text-neutral-500">
        {line.slice(lastIndex)}
      </span>,
    );
  }

  return <>{nodes}</>;
}
