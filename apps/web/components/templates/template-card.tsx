"use client";

import { CommunityTemplateWithUsername } from "@/lib/registry";
import {
  FaGithub,
  FaGitlab,
  FaTerminal,
  FaCheck,
  FaCopy,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion } from "motion/react";
import { TemplateDetailsModal } from "./template-details-modal";

interface TemplateCardProps {
  template: CommunityTemplateWithUsername;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scaffoldCommand = `scaffoldor @${template._username}/${template.slug}`;

  const copyCommand = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(scaffoldCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        layoutId={`card-${template._username}-${template.slug}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 transition-all hover:border-neutral-700 hover:bg-neutral-900/60 hover:shadow-2xl hover:shadow-emerald-500/5 h-full cursor-pointer"
      >
        {/* Premium Glow Effect */}
        {template.tier === "premium" && (
          <div className="absolute top-0 right-0 p-3">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
            <Badge className="relative z-10 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 uppercase text-[10px] tracking-widest px-2 py-0.5">
              Premium
            </Badge>
          </div>
        )}

        <div className="space-y-4">
          {/* Header: Author & Title & Source */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">
                {template._username}
              </span>
              <a
                href={template.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {template.platform === "gitlab" ? (
                  <div className="flex items-center gap-1">
                    <FaGitlab size={14} /> <span className="text-xs">Source</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <FaGithub size={14} /> <span className="text-xs">Source</span>
                  </div>
                )}
              </a>
            </div>

            <div>
              <h3 className="text-xl font-bold text-neutral-100">
                {template.name}
              </h3>
              <p className="mt-2 text-sm text-neutral-400 line-clamp-2 min-h-[40px]">
                {template.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Features / Tech Stack */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {template.framework !== "other" &&
                template.framework !== "none" && (
                  <Badge
                    variant="outline"
                    className="bg-neutral-950/50 border-neutral-800 text-neutral-300 hover:border-neutral-700 capitalize"
                  >
                    {template.framework}
                  </Badge>
                )}
              <Badge
                variant="outline"
                className="bg-neutral-950/50 border-neutral-800 text-neutral-300 hover:border-neutral-700 capitalize"
              >
                {template.type}
              </Badge>
            </div>

            {/* Tags (limited) */}
            <div className="flex flex-wrap gap-1.5">
              {template.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] text-neutral-500 bg-neutral-900/50 px-2 py-1 rounded-md border border-neutral-800/50"
                >
                  #{tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-[11px] text-neutral-600 px-1 py-1">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Actions */}
        <div className="mt-4 pt-4 border-t border-neutral-800/50">
          {/* Command Box */}
          <div
            onClick={copyCommand}
            className="relative group/cmd flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg bg-black/50 border border-neutral-800 hover:border-neutral-700 hover:bg-black transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FaTerminal className="text-neutral-600 shrink-0 text-[10px]" />
              <code className="text-xs font-mono text-neutral-400 truncate group-hover/cmd:text-neutral-300 transition-colors">
                {scaffoldCommand}
              </code>
            </div>
            <div className="shrink-0">
              {copied ? (
                <FaCheck className="text-emerald-500 text-[10px]" />
              ) : (
                <FaCopy className="text-neutral-600 group-hover/cmd:text-neutral-400 transition-colors text-[10px]" />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <TemplateDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={template}
      />
    </>
  );
}
