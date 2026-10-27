"use client";

import { useState } from "react";
import { FaCheck, FaCopy, FaTerminal } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface CopyCommandProps {
  command: string;
  className?: string;
  label?: string;
}

export function CopyCommand({ command, className, label }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access may be blocked; the command is still selectable.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy command: ${command}`}
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left font-mono text-[11px] transition-all",
        copied
          ? "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-300"
          : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700",
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <FaTerminal className="shrink-0 text-neutral-600" />
        <code className="truncate select-all">{command}</code>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-500">
        {copied ? (
          <>
            <FaCheck className="text-emerald-400" />
            Copied
          </>
        ) : (
          <>
            <FaCopy className="transition-colors group-hover:text-neutral-300" />
            {label ?? "Copy"}
          </>
        )}
      </span>
    </button>
  );
}
