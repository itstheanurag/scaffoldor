"use client";
import { CommunityTemplateWithUsername } from "@/lib/registry";
import { useState, useMemo } from "react";
import { TemplateCard } from "./template-card";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { Dropdown } from "../ui/dropdown";

interface TemplateSearchProps {
  initialTemplates: CommunityTemplateWithUsername[];
}

export function TemplateSearch({ initialTemplates }: TemplateSearchProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedFramework, setSelectedFramework] = useState<string>("all");

  // Extract unique options
  const frameworks = useMemo(() => {
    const s = new Set(initialTemplates.map((t) => t.framework));
    return Array.from(s).filter((f) => f !== "none");
  }, [initialTemplates]);

  const types = useMemo(() => {
    const s = new Set(initialTemplates.map((t) => t.type));
    return Array.from(s);
  }, [initialTemplates]);

  const filteredTemplates = useMemo(() => {
    return initialTemplates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description?.toLowerCase().includes(search.toLowerCase()) ||
        template.slug.toLowerCase().includes(search.toLowerCase()) ||
        template.author.name.toLowerCase().includes(search.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );

      const matchesType =
        selectedType === "all" || template.type === selectedType;
      const matchesFramework =
        selectedFramework === "all" || template.framework === selectedFramework;

      return matchesSearch && matchesType && matchesFramework;
    });
  }, [initialTemplates, search, selectedType, selectedFramework]);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="sticky top-20 z-40 -mx-1 px-1 py-4 bg-black/80 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search templates, authors, frameworks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-neutral-800 rounded-xl leading-5 bg-neutral-900/50 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex gap-4">
            <Dropdown
              label="All Types"
              value={selectedType}
              options={types}
              onChange={setSelectedType}
            />

            <Dropdown
              label="All Frameworks"
              value={selectedFramework}
              options={frameworks}
              onChange={setSelectedFramework}
              formatOption={(f) =>
                f === "other" ? "Other" : f.charAt(0).toUpperCase() + f.slice(1)
              }
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="min-h-[400px]">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={`${template._username}/${template.slug}`}
                  template={template}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-neutral-800/50 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-neutral-600 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300">
              No templates found
            </h3>
            <p className="text-neutral-500 mt-2 max-w-sm">
              Try adjusting your search query or filters to find what
              you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("all");
                setSelectedFramework("all");
              }}
              className="mt-6 text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
