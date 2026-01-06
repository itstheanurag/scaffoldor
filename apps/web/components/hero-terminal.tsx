"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";

export function HeroTerminal() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Templates", "Details", "CLI"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl transition-transform duration-500 ease-out group-hover:rotate-y-2 group-hover:rotate-x-2 transform-style-3d min-h-[400px]">
      {/* Window Controls */}
      <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
        <div className="ml-4 flex gap-4 text-xs font-medium text-neutral-500">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`relative px-1 transition-colors hover:text-neutral-300 ${
                activeTab === index ? "text-neutral-200" : ""
              }`}
            >
              {tab}
              {activeTab === index && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-neutral-200"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 bg-neutral-950/50 h-full min-h-[340px]">
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Preview Item 1 */}
              <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition-colors hover:border-neutral-700">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                    N
                  </div>
                  <div>
                    <div className="font-medium text-neutral-200">
                      Next.js SaaS Starter
                    </div>
                    <div className="text-xs text-neutral-500">
                      TypeScript • Tailwind • Prisma
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center text-xs text-neutral-400">
                    <svg
                      className="mr-1 h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    1,240
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                    Free
                  </span>
                </div>
              </div>

              {/* Preview Item 2 */}
              <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition-colors hover:border-neutral-700">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">
                    FS
                  </div>
                  <div>
                    <div className="font-medium text-neutral-200">
                      Full-Stack SaaS Pro
                    </div>
                    <div className="text-xs text-neutral-500">
                      Remix • Stripe • Supabase
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400">
                    Paid • $29
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-neutral-200">
                      Dependencies
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Automatically installed
                    </p>
                  </div>
                  <Badge variant="subtle-outline">v1.2.0</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "react",
                    "typescript",
                    "tailwindcss",
                    "prisma",
                    "shadcn/ui",
                    "framer-motion",
                  ].map((dep) => (
                    <div
                      key={dep}
                      className="text-xs text-neutral-400 bg-neutral-950/50 p-2 rounded border border-neutral-800/50 font-mono"
                    >
                      {dep}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              key="cli"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-lg bg-black p-4 font-mono text-xs text-neutral-400 h-full min-h-[160px] flex flex-col justify-center">
                <div className="flex gap-2">
                  <span className="text-purple-400">npx</span>
                  <span className="text-neutral-300">scaffoldor</span>
                  <span>init</span>
                  <span className="text-green-400">my-saas-app</span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-neutral-600">
                    Downloading template...
                  </div>
                  <div className="text-neutral-600">
                    Installing dependencies...
                  </div>
                  <div className="text-green-500">Done! Happy hacking.</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-1 z-[-1] rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40 animate-glow-pulse" />
    </div>
  );
}
