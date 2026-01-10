"use client";

import { CommunityTemplateWithUsername } from "@/lib/registry";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  FaGithub,
  FaGitlab,
  FaStar,
  FaCodeBranch,
  FaExclamationCircle,
  FaCheck,
  FaCopy,
  FaTerminal,
} from "react-icons/fa";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";

interface TemplateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: CommunityTemplateWithUsername;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 1, stiffness: 100, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export function TemplateDetailsModal({
  isOpen,
  onClose,
  template,
}: TemplateDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  const scaffoldCommand = `scaffoldor @${template._username}/${template.slug}`;

  const copyCommand = async () => {
    await navigator.clipboard.writeText(scaffoldCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldFetch =
    isOpen &&
    template.platform === "github" &&
    template.url.includes("github.com");

  const getApiUrl = () => {
    if (!shouldFetch) return null;
    try {
      const urlParts = template.url.split("/");
      // Handle trailing slash if present
      const cleanParts = urlParts.filter((p) => p.length > 0);
      const owner = cleanParts[cleanParts.length - 2];
      const repo = cleanParts[cleanParts.length - 1];
      if (owner && repo) {
        return `https://api.github.com/repos/${owner}/${repo}`;
      }
    } catch {
      return null;
    }
    return null;
  };

  const { data, isLoading } = useSWR(getApiUrl(), fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const stats = {
    stars: data?.stargazers_count || 0,
    forks: data?.forks_count || 0,
    open_issues: data?.open_issues_count || 0,
    loading: isLoading,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl bg-neutral-900 border border-neutral-800 p-0 overflow-hidden sm:rounded-2xl block">
            <div className="relative">
              {/* Premium Background Glow */}
              {template.tier === "premium" && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none" />
              )}

              {/* Header Section */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-400">
                          {template._username}
                        </span>
                        {template.tier === "premium" && (
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] uppercase font-bold px-2 py-0.5">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <DialogTitle className="text-2xl md:text-3xl font-bold text-white">
                        {template.name}
                      </DialogTitle>
                    </div>
                  </div>
                  <a
                    href={template.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-neutral-800/50 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"
                  >
                    {template.platform === "gitlab" ? (
                      <FaGitlab size={24} />
                    ) : (
                      <FaGithub size={24} />
                    )}
                  </a>
                </div>

                {/* Stats Grid */}
                {template.platform === "github" && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800 flex flex-col items-center justify-center gap-1">
                      <FaStar className="text-amber-400 text-lg mb-1" />
                      <span className="text-2xl font-bold text-white">
                        <AnimatedNumber value={stats.stars} />
                      </span>
                      <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                        Stars
                      </span>
                    </div>
                    <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800 flex flex-col items-center justify-center gap-1">
                      <FaCodeBranch className="text-blue-400 text-lg mb-1" />
                      <span className="text-2xl font-bold text-white">
                        <AnimatedNumber value={stats.forks} />
                      </span>
                      <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                        Forks
                      </span>
                    </div>
                    <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800 flex flex-col items-center justify-center gap-1">
                      <FaExclamationCircle className="text-emerald-400 text-lg mb-1" />
                      <span className="text-2xl font-bold text-white">
                        <AnimatedNumber value={stats.open_issues} />
                      </span>
                      <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                        Issues
                      </span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-neutral-300 text-lg leading-relaxed">
                    {template.description || "No description provided."}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {template.framework !== "other" &&
                      template.framework !== "none" && (
                        <Badge
                          variant="outline"
                          className="px-3 py-1 text-sm bg-neutral-900 border-neutral-700 text-neutral-300"
                        >
                          {template.framework}
                        </Badge>
                      )}
                    <Badge
                      variant="outline"
                      className="px-3 py-1 text-sm bg-neutral-900 border-neutral-700 text-neutral-300"
                    >
                      {template.type}
                    </Badge>
                    {template.tags.map((tag, i) => (
                      <Badge
                        key={`${tag}-${i}`}
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-neutral-800 text-neutral-400"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {template.features && template.features.length > 0 && (
                    <div className="pt-4 border-t border-neutral-800">
                      <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
                        Features included
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {template.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-neutral-300"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="capitalize">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-black/40 border-t border-neutral-800">
                <div className="flex flex-col gap-4">
                  <div
                    onClick={copyCommand}
                    className="group flex items-center justify-between gap-4 p-4 rounded-xl bg-black border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FaTerminal className="text-neutral-600 shrink-0" />
                      <code className="font-mono text-sm text-neutral-300 truncate">
                        {scaffoldCommand}
                      </code>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs text-neutral-600 font-medium group-hover:text-neutral-400 transition-colors hidden sm:block">
                        {copied ? "Copied!" : "Click to copy"}
                      </span>
                      {copied ? (
                        <FaCheck className="text-emerald-500" />
                      ) : (
                        <FaCopy className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
