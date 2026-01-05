import { FaGithub, FaGitlab } from "react-icons/fa";

export function TemplatePreview() {
  const templates = [
    {
      name: "nextjs-starter",
      description:
        "A batteries-included Next.js starter with Tailwind, TypeScript, and ESLint.",
      source: "github",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      maintainer: "scaffoldor",
    },
    {
      name: "express-api-boilerplate",
      description:
        "Production-ready Express.js API boilerplate with Docker and Swagger.",
      source: "github",
      tags: ["Express", "Node.js", "Docker"],
      maintainer: "community",
    },
    {
      name: "vue3-vite-template",
      description: "Minimal Vue 3 + Vite template for fast prototyping.",
      source: "gitlab",
      tags: ["Vue 3", "Vite", "Pinia"],
      maintainer: "vue-fans",
    },
    {
      name: "rust-cli-starter",
      description: "A fast Rust CLI tool starter with Clap and ColorEyre.",
      source: "github",
      tags: ["Rust", "CLI", "Clap"],
      maintainer: "rustacean",
    },
    {
      name: "django-cookiecutter",
      description: "A robust Django project template with best practices.",
      source: "github",
      tags: ["Django", "Python", "PostgreSQL"],
      maintainer: "django-stars",
    },
    {
      name: "sveltekit-blog",
      description: "A static blog starter for SvelteKit using Markdown.",
      source: "gitlab",
      tags: ["SvelteKit", "Markdown", "Blog"],
      maintainer: "svelte-lover",
    },
  ];

  return (
    <section
      id="templates"
      className="border-y border-neutral-800 bg-neutral-900/20 py-12 md:py-24 lg:py-32"
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Popular Templates
          </h2>
          <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Community-curated templates to get you started in seconds.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <div
              key={index}
              className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{template.name}</h3>
                  {template.source === "github" ? (
                    <FaGithub className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaGitlab className="h-5 w-5 text-orange-600" />
                  )}
                </div>
                <p className="text-sm text-gray-400">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span>by {template.maintainer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
