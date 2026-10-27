import Link from "next/link";
import { FaGithub, FaGitlab } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { getAllTemplates, getDisplayTags } from "@/lib/registry";
import { formatFramework, formatLabel, toTitleCase } from "@/lib/format";

export function TemplatePreview() {
  const templates = getAllTemplates().slice(0, 6);

  return (
    <section
      id="templates"
      className="border-y border-neutral-800 bg-neutral-900/20 py-12 md:py-24 lg:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              From the registry
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Real projects, ready to clone.
            </h2>
            <p className="mt-3 max-w-[600px] text-gray-400">
              Every entry is a real repository you can inspect before you run a
              single command.
            </p>
          </div>

          <Link
            href="/templates"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-100"
          >
            Browse all
            <BsArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 py-10 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={`${template._username}/${template.slug}`}
              href={`/templates/${template._username}/${template.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-neutral-900"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    {formatLabel(template.type)}
                  </span>
                  {template.platform === "gitlab" ? (
                    <FaGitlab className="h-4 w-4 text-orange-500/80" />
                  ) : (
                    <FaGithub className="h-4 w-4 text-neutral-500" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-200 transition-colors group-hover:text-emerald-300/90">
                    {toTitleCase(template.name)}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">
                    {template.description || "No description provided yet."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center rounded-full border border-neutral-700/80 bg-neutral-950/50 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                    {formatFramework(template.framework)}
                  </span>
                  {getDisplayTags(template)
                    .slice(0, 2)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-neutral-800 px-2.5 py-0.5 text-xs text-neutral-500"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-neutral-800/70 pt-4 text-xs text-gray-500">
                <span>by {template.author.name}</span>
                <span className="font-mono">@{template._username}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
