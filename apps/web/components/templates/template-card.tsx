"use client";

import { CommunityTemplateWithUsername } from "@/lib/registry";
import {
  FaGithub,
  FaGitlab,
  FaTerminal,
  FaCheck,
  FaCopy,
} from "react-icons/fa";
import { useState } from "react";
import { motion } from "motion/react";

interface TemplateCardProps {
  template: CommunityTemplateWithUsername;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [copied, setCopied] = useState(false);

  const scaffoldCommand = `scaffoldor @${template._username}/${template.slug}`;

  const copyCommand = async () => {
    await navigator.clipboard.writeText(scaffoldCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900 shadow-lg hover:shadow-xl"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-neutral-500">
                {template._username}
              </span>
              {template.tier === "premium" && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                  Premium
                </span>
              )}
            </div>
            <h3 className="font-bold text-lg text-neutral-100 group-hover:text-white transition-colors">
              {template.name}
            </h3>
          </div>
          <a
            href={template.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-white transition-colors"
            title="View Source"
            onClick={(e) => e.stopPropagation()}
          >
            {template.platform === "gitlab" ? (
              <FaGitlab size={20} />
            ) : (
              <FaGithub size={20} />
            )}
          </a>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-400 min-h-[40px]">
          {template.description || "No description provided."}
        </p>

        {/* Features */}
        {template.features && template.features.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold uppercase text-neutral-600 tracking-wider">
              Features
            </h4>
            <ul className="grid grid-cols-2 gap-1">
              {template.features.slice(0, 4).map((feature, i) => (
                <li
                  key={i}
                  className="text-xs text-neutral-500 flex items-center gap-1.5 truncate"
                >
                  <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                  {feature}
                </li>
              ))}
              {template.features.length > 4 && (
                <li className="text-xs text-neutral-600 italic pl-2.5">
                  +{template.features.length - 4} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {template.framework !== "other" && template.framework !== "none" && (
            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              {template.framework}
            </span>
          )}
          <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
            {template.type}
          </span>
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-400 border border-neutral-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Copy Command */}
      <div className="mt-6 pt-4 border-t border-neutral-800">
        <button
          onClick={copyCommand}
          className="w-full group/btn flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-black border border-neutral-800 hover:border-neutral-600 transition-all font-mono text-xs text-neutral-400"
        >
          <div className="flex items-center gap-2 truncate">
            <FaTerminal className="text-neutral-600 shrink-0" />
            <span className="group-hover/btn:text-neutral-300 transition-colors truncate">
              {scaffoldCommand}
            </span>
          </div>
          {copied ? (
            <FaCheck className="text-emerald-500 shrink-0" />
          ) : (
            <FaCopy className="text-neutral-600 group-hover/btn:text-neutral-400 transition-colors shrink-0" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
