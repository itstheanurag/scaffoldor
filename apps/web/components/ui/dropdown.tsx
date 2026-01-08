"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa6";

interface CustomDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  formatOption?: (option: string) => string;
}

export function Dropdown({
  label,
  value,
  options,
  onChange,
  formatOption = (o) => o.charAt(0).toUpperCase() + o.slice(1),
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-[160px]" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-xl bg-neutral-900/50 text-sm transition-all ${
          isOpen
            ? "border-emerald-500/50 ring-2 ring-emerald-500/20 text-emerald-400"
            : "border-neutral-800 text-neutral-300 hover:border-neutral-700"
        }`}
      >
        <span className="truncate">
          {value === "all" ? label : formatOption(value)}
        </span>
        <FaChevronDown
          className={`ml-2 text-xs transition-transform ${
            isOpen ? "text-emerald-500 rotate-180" : "text-neutral-500"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 p-1 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
              <button
                onClick={() => {
                  onChange("all");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                  value === "all"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
              >
                <span>{label}</span>
                {value === "all" && <FaCheck className="text-xs" />}
              </button>
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    value === option
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  <span className="truncate">{formatOption(option)}</span>
                  {value === option && <FaCheck className="text-xs" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
