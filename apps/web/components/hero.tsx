"use client";

import Link from "next/link";
import { FaTerminal } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroTerminal } from "@/components/hero-terminal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-[clamp(4rem,8vw,8rem)]">
      {/* Ambient Gradient Background */}

      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000",
        }}
      />

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-start space-y-8 animate-fade-in-up">
            <div className="flex flex-wrap gap-3">
              <Badge variant="subtle-outline">Community Templates</Badge>
              <Badge variant="subtle-fill">Premium One-Time Purchase</Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-tight text-white md:text-[3.5rem]">
                Start <span className="text-neutral-100">Faster</span> with{" "}
                <span className="text-neutral-100">Production-Ready</span>{" "}
                Templates
              </h1>
              <p className="max-w-[48ch] text-lg text-neutral-400">
                Discover, preview, and download curated GitHub and GitLab
                templates. Free community starters or premium, one-time purchase
                templates with lifetime access.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
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

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500">
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

          {/* Right Visual - Dashboard Showcase */}
          <div className="relative animate-fade-in-up delay-100 perspective-1000 group">
            <HeroTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}
