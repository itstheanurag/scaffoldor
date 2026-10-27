"use client";

import { CommunityTemplateWithUsername, getDisplayTags } from "@/lib/registry";
import Link from "next/link";
import {
  FaGithub,
  FaGitlab,
  FaTerminal,
  FaCheck,
  FaCopy,
  FaEye,
  FaArrowRight,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion } from "motion/react";
import { TemplateDetailsModal } from "./template-details-modal";
import { cn } from "@/lib/utils";
import { formatFramework, formatLabel, toTitleCase } from "@/lib/format";
import { FrameworkIcon } from "./framework-icon";

interface TemplateCardProps {
  template: CommunityTemplateWithUsername;
  index?: number;
}

export function TemplateCard({ template, index }: TemplateCardProps) {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scaffoldCommand = `npx scaffoldor @${template._username}/${template.slug}`;
  const detailHref = `/templates/${template._username}/${template.slug}`;
  const displayTags = getDisplayTags(template);
  const initial = template.author.name.charAt(0).toUpperCase();

  const copyCommand = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(scaffoldCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the command stays visible to copy manually.
    }
  };

  return (
    <>
      <motion.article
        layout
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/30 transition-colors duration-300 before:absolute before:inset-y-0 before:left-0 before:z-20 before:w-px before:bg-transparent before:transition-colors before:duration-300 hover:border-emerald-400/20 hover:bg-neutral-900/60 hover:shadow-[0_20px_45px_-30px_rgba(0,0,0,0.9)] hover:before:bg-emerald-400/40"
      >
        {/* Whole-card link sits behind the content. */}
        <Link
          href={detailHref}
          aria-label={`View ${template.name} by ${template.author.name}`}
          className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400/70"
        />

        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <div className="flex flex-1 flex-col p-5">
            {/* Index / category + source */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                {typeof index === "number" && (
                  <>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="h-px w-5 bg-neutral-700" />
                  </>
                )}
                <span>{formatLabel(template.type)}</span>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                {template.tier === "premium" && (
                  <Badge className="border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-300 hover:bg-amber-400/15">
                    Premium
                  </Badge>
                )}
                <a
                  href={template.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open source repository for ${template.name}`}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-md border border-neutral-800/80 p-1.5 text-neutral-500 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
                >
                  {template.platform === "gitlab" ? (
                    <FaGitlab className="h-3.5 w-3.5" />
                  ) : (
                    <FaGithub className="h-3.5 w-3.5" />
                  )}
                </a>
              </div>
            </div>

            {/* Title and description */}
            <div className="mt-5">
              <h3 className="text-xl font-semibold leading-snug tracking-tight text-neutral-200 transition-colors duration-300 group-hover:text-emerald-300/90">
                {toTitleCase(template.name)}
              </h3>
              <p className="mt-2.5 line-clamp-2 min-h-11 text-sm leading-relaxed text-neutral-400">
                {template.description || "No description provided yet."}
              </p>
            </div>

            {/* Stack */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {template.framework !== "none" && (
                <Badge
                  variant="outline"
                  className="gap-1.5 border-neutral-700/80 bg-neutral-950/60 px-2 py-0.5 text-[11px] font-medium text-neutral-300"
                >
                  <FrameworkIcon
                    framework={template.framework}
                    className="h-3 w-3 text-emerald-400/80"
                  />
                  {formatFramework(template.framework)}
                </Badge>
              )}
              {displayTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-800/80 px-2 py-0.5 text-[11px] text-neutral-500"
                >
                  {tag}
                </span>
              ))}
              {displayTags.length > 2 && (
                <span className="px-1 py-0.5 text-[11px] text-neutral-600">
                  +{displayTags.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.06] bg-black/20 p-4">
            <button
              type="button"
              onClick={copyCommand}
              aria-label={`Copy command to scaffold ${template.name}`}
              className={cn(
                "pointer-events-auto flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left font-mono text-[11px] transition-all",
                copied
                  ? "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-300"
                  : "border-neutral-800 bg-black/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <FaTerminal className="shrink-0 text-[10px] text-neutral-600" />
                <span className="truncate">{scaffoldCommand}</span>
              </span>
              {copied ? (
                <span className="flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-wider">
                  <FaCheck /> Copied
                </span>
              ) : (
                <FaCopy className="shrink-0 text-[10px] text-neutral-600 transition-colors group-hover:text-neutral-400" />
              )}
            </button>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <Link
                href={`/templates/${template._username}`}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto flex min-w-0 items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-200"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-700/80 bg-neutral-800/80 text-[9px] font-semibold text-neutral-300">
                  {initial}
                </span>
                <span className="truncate font-medium">
                  @{template._username}
                </span>
              </Link>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  aria-label={`Quick preview of ${template.name}`}
                  className="pointer-events-auto flex items-center gap-1.5 text-neutral-600 transition-colors hover:text-neutral-300"
                >
                  <FaEye className="text-[11px]" />
                  <span className="text-[11px]">Preview</span>
                </button>
                <Link
                  href={detailHref}
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-auto hidden items-center gap-1 text-[11px] font-medium text-neutral-500 transition-colors hover:text-emerald-300/80 group-hover:text-emerald-300/80 sm:flex"
                >
                  Details
                  <FaArrowRight className="text-[9px] transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      <TemplateDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={template}
      />
    </>
  );
}
