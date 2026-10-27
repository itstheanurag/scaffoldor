const FRAMEWORK_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  nuxt: "Nuxt",
  react: "React",
  "react-native": "React Native",
  svelte: "Svelte",
  sveltekit: "SvelteKit",
  angular: "Angular",
  astro: "Astro",
  solid: "Solid",
  qwik: "Qwik",
  vue: "Vue",
  remix: "Remix",
  express: "Express",
  fastify: "Fastify",
  hono: "Hono",
  elysia: "Elysia",
  nestjs: "NestJS",
  koa: "Koa",
  expo: "Expo",
  flutter: "Flutter",
  none: "None",
  other: "Other",
};

function capitalizeWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Turn a hyphenated identifier into display text: `data-tables` → `Data Tables`. */
export function formatLabel(value: string): string {
  return value.split("-").map(capitalizeWord).join(" ");
}

/** Human-friendly framework name, preserving brand casing (Next.js, NestJS, …). */
export function formatFramework(value: string): string {
  return FRAMEWORK_LABELS[value] ?? formatLabel(value);
}

/** Title-case a free-form template name without changing existing capitalisation. */
export function toTitleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}
