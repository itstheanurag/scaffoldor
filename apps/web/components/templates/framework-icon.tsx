import type { IconType } from "react-icons";
import {
  SiAngular,
  SiAstro,
  SiExpo,
  SiExpress,
  SiFastify,
  SiFlutter,
  SiHono,
  SiKoa,
  SiNestjs,
  SiNextdotjs,
  SiNuxtdotjs,
  SiQwik,
  SiReact,
  SiRemix,
  SiSolid,
  SiSvelte,
  SiVuedotjs,
} from "react-icons/si";
import { FaCube } from "react-icons/fa";

const FRAMEWORK_ICONS: Record<string, IconType> = {
  nextjs: SiNextdotjs,
  react: SiReact,
  "react-native": SiReact,
  vue: SiVuedotjs,
  svelte: SiSvelte,
  sveltekit: SiSvelte,
  angular: SiAngular,
  nuxt: SiNuxtdotjs,
  astro: SiAstro,
  solid: SiSolid,
  qwik: SiQwik,
  express: SiExpress,
  fastify: SiFastify,
  hono: SiHono,
  nestjs: SiNestjs,
  koa: SiKoa,
  remix: SiRemix,
  expo: SiExpo,
  flutter: SiFlutter,
};

export function FrameworkIcon({
  framework,
  className,
}: {
  framework: string;
  className?: string;
}) {
  const Icon = FRAMEWORK_ICONS[framework] ?? FaCube;
  return <Icon className={className} aria-hidden="true" />;
}
