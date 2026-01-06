"use client";

import { motion } from "motion/react";
import { FaSearch, FaPlus, FaBell, FaUserCircle } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  {
    name: "Next.js SaaS Starter",
    desc: "Auth, Payments, Database",
    tags: ["Next.js", "React", "Prisma"],
    color: "bg-blue-500/10 text-blue-400",
    icon: "N",
  },
  {
    name: "E-Commerce Pro",
    desc: "Shopify, Stripe, Analytics",
    tags: ["Remix", "Shopify", "Stripe"],
    color: "bg-purple-500/10 text-purple-400",
    icon: "E",
  },
  {
    name: "Documentation Site",
    desc: "MDX, Search, SEO",
    tags: ["Astro", "MDX", "Algolia"],
    color: "bg-orange-500/10 text-orange-400",
    icon: "D",
  },
];

export function HeroDashboard() {
  return (
    <div className="w-full max-w-6xl rounded-lg border border-neutral-800 bg-neutral-900/50 shadow-xl backdrop-blur-sm overflow-hidden text-left">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <div className="h-4 w-[1px] bg-neutral-800" />
          <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-950/50 px-3 py-1.5 rounded-full border border-neutral-800/50 w-64">
            <FaSearch className="w-3 h-3" />
            <span>Search templates...</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-neutral-500">
          <FaBell className="w-3.5 h-3.5 hover:text-neutral-300 transition-colors cursor-pointer" />
          <FaUserCircle className="w-4 h-4 hover:text-neutral-300 transition-colors cursor-pointer" />
        </div>
      </div>

      <div className="flex h-[400px]">
        {/* Sidebar */}
        <div className="hidden w-48 border-r border-neutral-800 bg-neutral-900/30 p-4 md:block">
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Discover
              </div>
              <div className="space-y-0.5">
                <div className="rounded-md bg-neutral-800/50 px-2 py-1.5 text-sm font-medium text-neutral-200">
                  Featured
                </div>
                <div className="px-2 py-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-300 cursor-pointer">
                  New Arrivals
                </div>
                <div className="px-2 py-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-300 cursor-pointer">
                  Popular
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Library
              </div>
              <div className="space-y-0.5">
                <div className="px-2 py-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-300 cursor-pointer">
                  My Templates
                </div>
                <div className="px-2 py-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-300 cursor-pointer">
                  Downloads
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-hidden relative">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-neutral-200">
                Featured Templates
              </h3>
              <p className="text-sm text-neutral-500">
                Production-ready starters for your next project.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="subtle-outline" className="hidden sm:flex">
                Filter by Stack
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template, i) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="group relative rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-900/60"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${template.color} font-bold`}
                  >
                    {template.icon}
                  </div>
                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-neutral-800 p-1.5 text-neutral-400 hover:text-white cursor-pointer">
                      <FaPlus className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                <h4 className="font-medium text-neutral-200">
                  {template.name}
                </h4>
                <p className="mb-4 text-xs text-neutral-500">{template.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-neutral-950 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 border border-neutral-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fade out bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
