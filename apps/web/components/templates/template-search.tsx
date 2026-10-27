"use client";

import { CommunityTemplateWithUsername } from "@/lib/registry";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { TemplateCard } from "./template-card";
import { FaArrowRight, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";
import { Dropdown } from "../ui/dropdown";
import { formatFramework, formatLabel } from "@/lib/format";
import { CONTENT_LINKS } from "@/lib/link";

interface TemplateSearchProps {
  initialTemplates: CommunityTemplateWithUsername[];
  initialQuery?: string;
}

export function TemplateSearch({
  initialTemplates,
  initialQuery = "",
}: TemplateSearchProps) {
  const [search, setSearch] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFramework, setSelectedFramework] = useState("all");
  const [sort, setSort] = useState("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const frameworks = useMemo(() => {
    const set = new Set(
      initialTemplates
        .map((template) => template.framework)
        .filter((framework) => framework !== "none"),
    );
    return Array.from(set).sort();
  }, [initialTemplates]);

  const types = useMemo(() => {
    const set = new Set(initialTemplates.map((template) => template.type));
    return Array.from(set).sort();
  }, [initialTemplates]);

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matches = initialTemplates.filter((template) => {
      const matchesSearch =
        query.length === 0 ||
        template.name.toLowerCase().includes(query) ||
        template.slug.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query) ||
        template.author.name.toLowerCase().includes(query) ||
        template._username.toLowerCase().includes(query) ||
        template.framework.toLowerCase().includes(query) ||
        template.type.toLowerCase().includes(query) ||
        template.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        template.features.some((feature) =>
          feature.toLowerCase().includes(query),
        );

      const matchesType =
        selectedType === "all" || template.type === selectedType;
      const matchesFramework =
        selectedFramework === "all" || template.framework === selectedFramework;

      return matchesSearch && matchesType && matchesFramework;
    });

    if (sort === "name") {
      matches.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "author") {
      matches.sort(
        (a, b) =>
          a.author.name.localeCompare(b.author.name) ||
          a.name.localeCompare(b.name),
      );
    }

    return matches;
  }, [initialTemplates, search, selectedType, selectedFramework, sort]);

  const hasFilters =
    search.trim().length > 0 ||
    selectedType !== "all" ||
    selectedFramework !== "all";

  const clearFilters = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedFramework("all");
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (
        !isTyping &&
        (event.key === "/" ||
          ((event.metaKey || event.ctrlKey) && event.key === "k"))
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (
        event.key === "Escape" &&
        document.activeElement === searchInputRef.current
      ) {
        if (search) {
          setSearch("");
        } else {
          searchInputRef.current?.blur();
        }
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [search]);

  return (
    <div className="space-y-8">
      {/* Sticky filter bar */}
      <div className="sticky top-20 z-30">
        <div className="rounded-2xl border border-white/10 bg-neutral-950/85 p-2 shadow-[0_16px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="group relative flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-emerald-400" />
              <input
                ref={searchInputRef}
                id="template-search"
                type="search"
                role="searchbox"
                aria-label="Search templates"
                placeholder="Search templates…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-xl border border-transparent bg-transparent pl-11 pr-20 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-emerald-400/30 focus:bg-neutral-900/70 [&::-webkit-search-cancel-button]:hidden"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              ) : (
                <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 sm:flex">
                  <kbd className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] leading-none text-neutral-400">
                    /
                  </kbd>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                    search
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 lg:border-l lg:border-white/[0.07] lg:pl-2">
              <div className="flex flex-1 gap-2 lg:flex-none">
                <Dropdown
                  label="All types"
                  value={selectedType}
                  options={types}
                  onChange={setSelectedType}
                  formatOption={formatLabel}
                />
                <Dropdown
                  label="All stacks"
                  value={selectedFramework}
                  options={frameworks}
                  onChange={setSelectedFramework}
                  formatOption={formatFramework}
                />
                <div className="hidden sm:block">
                  <Dropdown
                    label="Sort: Featured"
                    value={sort}
                    options={["name", "author"]}
                    onChange={setSort}
                    formatOption={(option) =>
                      option === "name"
                        ? "Name A–Z"
                        : option === "author"
                          ? "Author A–Z"
                          : option
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result summary and active filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400" aria-live="polite">
          {hasFilters ? (
            <>
              <span className="font-semibold text-neutral-200">
                {filteredTemplates.length}
              </span>{" "}
              of {initialTemplates.length} template
              {initialTemplates.length === 1 ? "" : "s"}
            </>
          ) : (
            <>
              <span className="font-semibold text-neutral-200">
                {initialTemplates.length}
              </span>{" "}
              template{initialTemplates.length === 1 ? "" : "s"} in the registry
            </>
          )}
        </p>

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {search.trim() && (
              <FilterChip
                label={`“${search.trim()}”`}
                onRemove={() => setSearch("")}
              />
            )}
            {selectedType !== "all" && (
              <FilterChip
                label={formatLabel(selectedType)}
                onRemove={() => setSelectedType("all")}
              />
            )}
            {selectedFramework !== "all" && (
              <FilterChip
                label={formatFramework(selectedFramework)}
                onRemove={() => setSelectedFramework("all")}
              />
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-100 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredTemplates.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => (
              <TemplateCard
                key={`${template._username}/${template.slug}`}
                template={template}
                index={index}
              />
            ))}
          </AnimatePresence>

          {/* Completes the last row on a three-column grid and gives people a
              way to contribute without leaving the catalog. */}
          {filteredTemplates.length % 3 === 2 && (
            <Link
              href={`${CONTENT_LINKS.GITHUB}/blob/main/content/templates/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full min-h-[260px] flex-col justify-between rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 p-5 transition-colors hover:border-emerald-400/25 hover:bg-neutral-900/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Next
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-500 transition-colors group-hover:border-emerald-400/20 group-hover:text-emerald-300">
                  <FaPlus className="h-3 w-3" />
                </span>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-neutral-300">
                  Your template here.
                </h3>
                <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-neutral-500">
                  Add a starter to the open registry and help the next developer
                  ship faster.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-emerald-300/80">
                  Submit a template
                  <FaArrowRight className="text-[9px] transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 px-6 py-20 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
            <FaSearch className="h-5 w-5 text-neutral-600" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-neutral-200">
            No templates match those filters
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            Try a broader search, or reset the stack and type filters to see the
            full registry.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-700 hover:bg-neutral-800"
          >
            Reset filters
          </button>
        </motion.div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] py-1 pl-3 pr-1.5 text-xs text-emerald-200">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full p-1 text-emerald-300/70 transition-colors hover:bg-emerald-400/15 hover:text-emerald-200"
      >
        <FaTimes className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}
