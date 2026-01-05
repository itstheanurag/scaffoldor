"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

const steps = [
  { type: "command", text: "npx scaffoldor init my-app" },
  { type: "output", text: " " },
  { type: "prompt", text: "Select a template:", value: "nextjs-starter" },
  { type: "prompt", text: "Select package manager:", value: "pnpm" },
  { type: "output", text: " " },
  { type: "process", text: "Resolving packages..." },
  { type: "process", text: "Downloading template from registry..." },
  { type: "process", text: "Installing dependencies..." },
  { type: "process", text: "Initializing git repository..." },
  { type: "success", text: "Successfully scaffolded my-app!" },
  { type: "info", text: "cd my-app" },
  { type: "info", text: "pnpm dev" },
];

export function CliOutputShowcase() {
  const [displayedSteps, setDisplayedSteps] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      // Clear steps initially
      setDisplayedSteps([]);

      for (const step of steps) {
        if (!isMounted) break;

        // Add the current step to the display list
        setDisplayedSteps((prev) => [...prev, step]);

        // Calculate how long to wait before showing the next step
        let waitTime = 100; // Base minimal delay

        if (step.type === "command") {
          // Wait for typing (50ms char) + buffer
          waitTime = step.text.length * 50 + 500;
        } else if (step.type === "process") {
          waitTime = 600;
        } else if (step.type === "prompt") {
          waitTime = 800; // Wait for "user" to select
        } else if (step.type === "success") {
          waitTime = 1000;
        }

        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    };

    runSequence();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="font-mono text-sm leading-relaxed p-4 h-full min-h-[380px] bg-[#0c0c0c] text-gray-300 rounded-b-xl overflow-y-auto scrollbar-hide">
      {displayedSteps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="mb-1"
        >
          {step.type === "command" && (
            <div className="flex items-center gap-2 text-white">
              <span className="text-blue-500">➜</span>
              <span className="text-cyan-400">~</span>
              <Typewriter text={step.text} />
            </div>
          )}
          {step.type === "prompt" && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">?</span>
              <span className="font-bold text-white">{step.text}</span>
              <span className="text-cyan-500">{step.value}</span>
            </div>
          )}
          {step.type === "process" && (
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-blue-500">info</span> {step.text}
            </div>
          )}
          {step.type === "success" && (
            <div className="mt-4 font-bold text-green-400">{step.text}</div>
          )}
          {step.type === "info" && (
            <div className="text-gray-500">{step.text}</div>
          )}
          {step.type === "output" && <div className="h-1" />}
        </motion.div>
      ))}
      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2.5 h-4 bg-gray-500 ml-1 align-middle"
      />
    </div>
  );
}

function Typewriter({ text }: { text: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    // Typing effect needs to be slightly faster or match the calculation
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplay(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Matches the 50ms/char calculation in parent
    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
}
