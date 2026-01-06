"use client";
import { FaSearch, FaTerminal, FaCogs, FaCheckCircle } from "react-icons/fa";
import { motion } from "motion/react";
import {
  howItWorksContainer as container,
  howItWorksCard as card,
  howItWorksIcon as iconAnim,
  howItWorksText as textAnim,
} from "../variants/how-it-works";

export function HowItWorks() {
  const steps = [
    {
      icon: <FaSearch className="h-6 w-6" />,
      title: "Discover a Template",
      description: "Find the best template for your project.",
      animatedCard: (
        <div className="relative h-24 w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <FaSearch className="h-3 w-3 text-neutral-500" />
            <div className="h-2 w-24 rounded-full bg-neutral-800" />
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              show: {
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="mt-2 space-y-2"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { x: -10, opacity: 0 },
                  show: { x: 0, opacity: 1 },
                }}
                className="flex items-center gap-2"
              >
                <div className="h-6 w-6 rounded bg-neutral-900" />
                <div className="space-y-1">
                  <div className="h-1.5 w-16 rounded-full bg-neutral-800" />
                  <div className="h-1.5 w-10 rounded-full bg-neutral-800" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
    },
    {
      icon: <FaTerminal className="h-6 w-6" />,
      title: "Run the CLI",
      description: "One command to fetch the template.",
      animatedCard: (
        <div className="relative h-24 w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-3 font-mono text-[10px]">
          <div className="flex gap-1.5 pb-2">
            <div className="h-2 w-2 rounded-full bg-red-500/50" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
            <div className="h-2 w-2 rounded-full bg-green-500/50" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-blue-400">➜</span>{" "}
            <span className="text-neutral-400">~</span> npx scaffoldor init
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="ml-1 inline-block h-2.5 w-1.5 bg-neutral-500 align-middle"
            />
          </motion.div>
        </div>
      ),
    },
    {
      icon: <FaCogs className="h-6 w-6" />,
      title: "Customize Setup",
      description: "Preferred Package managers",
      animatedCard: (
        <div className="relative h-24 w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-2 w-20 rounded-full bg-neutral-800" />
                <motion.div
                  initial={{
                    backgroundColor: "#262626",
                    justifyItems: "start",
                  }} // neutral-800
                  whileInView={{ backgroundColor: "#3b82f6" }} // blue-500
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.4 + 0.5, duration: 0.3 }}
                  className="flex h-4 w-7 rounded-full p-0.5"
                >
                  <motion.div
                    initial={{ x: 0 }}
                    whileInView={{ x: 12 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.4 + 0.5, duration: 0.3 }}
                    className="h-3 w-3 rounded-full bg-white shadow-sm"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <FaCheckCircle className="h-6 w-6" />,
      title: "Clean Git Init",
      description: "Fresh repository. No history. No traces.",
      animatedCard: (
        <div className="relative h-24 w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neutral-700" />
              <div className="h-2 w-full rounded-full bg-neutral-900" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neutral-700" />
              <div className="h-2 w-full rounded-full bg-neutral-900" />
            </div>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-1 flex items-center justify-center gap-1 rounded bg-green-500/10 py-1 text-[10px] text-green-500"
            >
              <FaCheckCircle className="h-3 w-3" />
              <span>Git Initialized</span>
            </motion.div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="border-y border-neutral-800 bg-neutral-900/20 py-12 md:py-24 lg:py-32">
      <div className="container mx-auto space-y-4 max-w-7xl px-4">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
          How it works
        </h2>
        <p className="text-neutral-400 text-balance max-w-3xl">
          Scaffoldor is a community-driven template registry and CLI tool that
          handles the clean setup, so you can focus on building the future.
        </p>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mx-auto grid overflow-hidden rounded-xl border border-neutral-800 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={card}
              className={`flex h-[180px] flex-col justify-between p-6 border-neutral-800 ${index !== 0 ? "border-t sm:border-t-0 sm:border-l" : ""}`}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    variants={iconAnim}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-neutral-800"
                  >
                    {step.icon}
                  </motion.div>

                  {/* Text */}
                  <motion.div variants={textAnim} className="flex flex-col">
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </motion.div>
                </div>
                {step.animatedCard}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
