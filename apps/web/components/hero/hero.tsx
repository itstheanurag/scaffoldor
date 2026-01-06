"use client";

import Link from "next/link";
import { FaTerminal } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroDashboard } from "@/components/hero/dashboard";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24">
      {/* Ambient Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000",
        }}
      />

      {/* Noise Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.06] mix-blend-overlay pointer-events-none">
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

      <div className="container relative z-10 mx-auto px-6 max-w-7xl flex flex-col items-center text-center mt-16">
        {/* Header Content Vertical Flow */}
        <div className="flex flex-col items-center space-y-8 animate-fade-in-up max-w-3xl mx-auto mb-16">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="subtle-outline"
              className="flex items-center gap-2 px-3 py-1 text-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Community Templates
            </Badge>

            <Badge
              variant="subtle-fill"
              className="flex items-center gap-2 px-3 py-1 text-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Premium One-Time Purchase
            </Badge>
          </div>

          <div className="space-y-4">
            <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-white md:text-[4rem]">
              Start <span className="text-neutral-100">Faster</span> with{" "}
              <span className="text-neutral-100">Production-Ready</span>{" "}
              Templates
            </h1>
            <p className="max-w-[48ch] mx-auto text-lg text-neutral-400">
              Discover, preview, and download curated GitHub and GitLab
              templates. Free community starters or premium, one-time purchase
              templates with lifetime access.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#templates"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "group"
              )}
            >
              Browse Templates
              <FaArrowRight className="ml-2 h-4 w-4 icon-slide-right" />
            </Link>
            <Link
              href="#cli"
              className={cn(
                buttonVariants({ variant: "secondary-action", size: "lg" }),
                "group"
              )}
            >
              <FaTerminal className="mr-2 h-4 w-4" />
              Install via CLI
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
              No Git History Included
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
              Works with GitHub & GitLab
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
              Choose Your Package Manager
            </span>
          </div>
        </div>

        {/* Dashboard Visual */}
        <div className="w-full relative animate-fade-in-up delay-200 perspective-1000 group px-2 md:px-0">
          <div className="relative transform-style-3d transition-transform duration-700 hover:rotate-x-2 flex justify-center">
            <HeroDashboard />

            {/* Glow Effect */}
            <div className="absolute -inset-1 z-[-1] rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40 animate-glow-pulse max-w-5xl mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
