"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.25,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // easeOut curve
    },
  },
};
const features = [
  {
    title: "Clean Slate",
    description:
      "Automatically removes existing git history and remote origins.",
  },
  {
    title: "Smart Install",
    description:
      "Detects your preferred package manager (npm, pnpm, bun) and installs dependencies.",
  },
  {
    title: "Fresh Start",
    description:
      "Initializes a pristine git repository, ready for your first commit.",
  },
  {
    title: "Universal Support",
    description: "Works seamlessly with any GitHub or GitLab repository URL.",
  },
];

export function StepsShowcase() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid gap-6 py-8"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          variants={item}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-mono text-white">
              {index + 1}
            </div>
            <h3 className="font-medium text-white">{feature.title}</h3>
          </div>
          <p className="pl-9 text-sm text-gray-400 leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
