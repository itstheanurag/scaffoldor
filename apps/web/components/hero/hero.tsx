import Link from "next/link";
import Image from "next/image";
import { FaTerminal } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTENT_LINKS } from "@/lib/link";

interface HeroProps {
  templateCount: number;
  frameworkCount: number;
  authorCount: number;
}

export function Hero({
  templateCount,
  frameworkCount,
  authorCount,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 pb-16 pt-32 md:pb-20 md:pt-36">
      {/* Ambient curved gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000",
        }}
      />

      {/* Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="flex max-w-3xl animate-fade-in-up flex-col items-center space-y-7">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="subtle-outline"
              className="flex items-center gap-2 px-3 py-1 text-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {templateCount} community templates
            </Badge>

            <Badge
              variant="subtle-fill"
              className="flex items-center gap-2 px-3 py-1 text-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
              GitHub &amp; GitLab
            </Badge>
          </div>

          <div className="space-y-4">
            <h1 className="text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-neutral-200 md:text-[4rem]">
              Start with a template that{" "}
              <span className="text-emerald-300/80">already works.</span>
            </h1>
            <p className="mx-auto max-w-[52ch] text-pretty text-lg leading-relaxed text-neutral-400">
              Browse community-built starters for web, backend, mobile, and CLI
              projects. Inspect the stack, copy one command, and get a clean
              project in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/templates"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "group",
              )}
            >
              Browse Templates
              <FaArrowRight className="ml-2 h-4 w-4 icon-slide-right" />
            </Link>
            <Link
              href={CONTENT_LINKS.CLI_INSTALL}
              target="_blank"
              className={cn(
                buttonVariants({ variant: "secondary-action", size: "lg" }),
                "group",
              )}
            >
              <FaTerminal className="mr-2 h-4 w-4" />
              Install via CLI
            </Link>
          </div>

          <dl className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Stat value={templateCount} label="Templates" />
            <Stat value={frameworkCount} label="Stacks" />
            <Stat value={authorCount} label="Contributors" />
          </dl>
        </div>

        <div className="relative mt-14 w-full max-w-6xl animate-fade-in-up delay-200">
          <div className="flex justify-center">
            <Image
              src="/scaffoldor.png"
              alt="Scaffoldor template gallery"
              width={1920}
              height={1080}
              className="w-full rounded-xl border border-neutral-800 shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </dt>
      <dd className="order-1 text-lg font-semibold tabular-nums text-neutral-200">
        {value}
      </dd>
    </div>
  );
}
