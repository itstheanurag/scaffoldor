"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaCheck, FaCopy, FaFileCode } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  exampleFile,
  schemaFields,
  schemaGroups,
  schemaStats,
} from "@/lib/schema-data";
import { CONTENT_LINKS } from "@/lib/link";
import { cn } from "@/lib/utils";

interface SchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "fields" | "example";

export function SchemaViewerModal({ isOpen, onClose }: SchemaViewerModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("fields");

  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(exampleFile, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the JSON stays selectable.
    }
  };

  const exampleLines = JSON.stringify(exampleFile, null, 2).split("\n");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-5xl gap-0 overflow-hidden border-neutral-800 bg-neutral-950 p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">
          Scaffoldor registry schema
        </DialogTitle>
        <DialogDescription className="sr-only">
          Browse the fields, constraints, and example JSON for contributing a
          template to the Scaffoldor registry.
        </DialogDescription>

        <div className="flex max-h-[88vh] min-h-0 w-full min-w-0 flex-col sm:h-[min(88vh,780px)]">
          {/* Header */}
          <header className="min-w-0 shrink-0 border-b border-neutral-800 px-5 py-4 pr-14 sm:px-6 sm:pr-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300">
                  <FaFileCode className="text-sm" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-neutral-200">
                    Registry schema
                  </h2>
                  <p className="text-xs text-neutral-500">
                    The JSON contract behind every template
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <HeaderStat value={schemaStats.total} label="fields" />
                <HeaderStat value={schemaStats.required} label="required" />
                <span className="hidden rounded-full border border-neutral-800 bg-neutral-900 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500 sm:inline-flex">
                  JSON
                </span>
              </div>
            </div>
          </header>

          {/* Toolbar */}
          <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-800 px-5 py-3 sm:px-6">
            <div
              role="tablist"
              aria-label="Schema views"
              className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900/60 p-1"
            >
              <TabButton
                active={activeTab === "fields"}
                onClick={() => setActiveTab("fields")}
                controls="schema-fields-panel"
                id="schema-fields-tab"
              >
                Fields
                <span className="rounded-full bg-neutral-800 px-1.5 py-0.5 text-[10px] tabular-nums text-neutral-400">
                  {schemaStats.total}
                </span>
              </TabButton>
              <TabButton
                active={activeTab === "example"}
                onClick={() => setActiveTab("example")}
                controls="schema-example-panel"
                id="schema-example-tab"
              >
                Example JSON
              </TabButton>
            </div>

            <button
              type="button"
              onClick={copyExample}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                copied
                  ? "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-300"
                  : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200",
              )}
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied" : "Copy example"}
            </button>
          </div>

          {/* Content */}
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-6">
            {activeTab === "fields" ? (
              <div
                id="schema-fields-panel"
                role="tabpanel"
                aria-labelledby="schema-fields-tab"
                className="space-y-8"
              >
                {schemaGroups.map((group) => {
                  const fields = schemaFields.filter(
                    (field) => field.group === group.id,
                  );
                  if (fields.length === 0) return null;

                  return (
                    <section key={group.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-200">
                            {group.label}
                          </h3>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {group.description}
                          </p>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                          {fields.length} field{fields.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="mt-3 gap-3 md:columns-2 [&>*]:mb-3 [&>*]:break-inside-avoid">
                        {fields.map((field) => (
                          <FieldCard key={field.name} field={field} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div
                id="schema-example-panel"
                role="tabpanel"
                aria-labelledby="schema-example-tab"
                className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]"
              >
                <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
                  <div className="flex items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900/50 px-3 py-2">
                    <span className="truncate font-mono text-[11px] text-neutral-500">
                      content/templates/your-username/index.json
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                      JSON
                    </span>
                  </div>
                  <div className="max-h-[460px] overflow-auto py-3 font-mono text-[11px] leading-5">
                    {exampleLines.map((line, index) => (
                      <div key={index} className="flex px-3">
                        <span className="w-7 shrink-0 select-none pr-3 text-right text-neutral-700">
                          {index + 1}
                        </span>
                        <span className="whitespace-pre text-neutral-300">
                          {line || " "}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="space-y-3">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                    <h3 className="text-sm font-semibold text-neutral-200">
                      How to submit
                    </h3>
                    <ol className="mt-4 space-y-4">
                      <Step number="1">
                        Fork the repository and add{" "}
                        <code className="text-neutral-400">index.json</code>{" "}
                        under your username.
                      </Step>
                      <Step number="2">
                        Run the registry build and make sure validation passes.
                      </Step>
                      <Step number="3">
                        Open a pull request with the template details.
                      </Step>
                    </ol>
                  </div>

                  <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
                    <p className="text-xs leading-relaxed text-emerald-200/80">
                      <span className="font-semibold text-emerald-300">
                        Tip:
                      </span>{" "}
                      use a unique slug. Duplicate slugs within the same
                      username fail the registry build.
                    </p>
                  </div>
                </aside>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="min-w-0 shrink-0 border-t border-neutral-800 bg-neutral-950 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-500">
                <span className="text-neutral-600">Location</span>{" "}
                <code className="rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-400">
                  content/templates/&lt;username&gt;/index.json
                </code>
              </p>

              <Link
                href={`${CONTENT_LINKS.GITHUB}/blob/main/content/templates/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 text-xs font-medium text-neutral-300 transition-colors hover:text-neutral-100"
              >
                Read the contribution guide
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HeaderStat({ value, label }: { value: number; label: string }) {
  return (
    <span className="hidden items-baseline gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-1 sm:inline-flex">
      <span className="font-mono text-xs font-semibold tabular-nums text-neutral-300">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-neutral-600">
        {label}
      </span>
    </span>
  );
}

function TabButton({
  active,
  onClick,
  controls,
  id,
  children,
}: {
  active: boolean;
  onClick: () => void;
  controls: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-neutral-800 text-neutral-200"
          : "text-neutral-500 hover:text-neutral-300",
      )}
    >
      {children}
    </button>
  );
}

function FieldCard({ field }: { field: (typeof schemaFields)[number] }) {
  return (
    <article className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <code className="font-mono text-sm text-emerald-300/90">
            {field.name}
          </code>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
            {field.type}
          </span>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            field.required
              ? "border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
              : "border border-neutral-800 bg-neutral-900 text-neutral-500",
          )}
        >
          {field.required ? "required" : "optional"}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
        {field.description}
      </p>

      {(field.constraint || field.defaultValue) && (
        <dl className="mt-3 space-y-1 text-[11px]">
          {field.constraint && (
            <div className="flex gap-2">
              <dt className="shrink-0 text-neutral-600">Rule</dt>
              <dd className="text-neutral-400">{field.constraint}</dd>
            </div>
          )}
          {field.defaultValue && (
            <div className="flex gap-2">
              <dt className="shrink-0 text-neutral-600">Default</dt>
              <dd>
                <code className="font-mono text-neutral-400">
                  {field.defaultValue}
                </code>
              </dd>
            </div>
          )}
        </dl>
      )}

      {field.options && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {field.options.map((option) => (
            <span
              key={option}
              className="rounded-md border border-neutral-800 bg-neutral-950/60 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400"
            >
              {option}
            </span>
          ))}
        </div>
      )}

      {field.example && (
        <div className="mt-3 truncate rounded-md border border-neutral-800 bg-black/40 px-2.5 py-2 font-mono text-[11px] text-neutral-500">
          {field.example}
        </div>
      )}
    </article>
  );
}

function Step({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3 text-xs leading-relaxed text-neutral-400">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 font-mono text-[10px] text-neutral-400">
        {number}
      </span>
      <span>{children}</span>
    </li>
  );
}
