"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { BsStar } from "react-icons/bs";
import { FaCube } from "react-icons/fa6";

const navVariants = {
  top: {
    y: 0,
    backgroundColor: "rgba(0,0,0,0)",
    borderColor: "rgba(0,0,0,0)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
  },
  scrolled: {
    y: 2,
    backgroundColor: "rgba(10,10,10,0.85)",
    borderColor: "rgba(38,38,38,1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none max-w-7xl mx-auto p-3">
      <motion.nav
        variants={navVariants}
        initial="top"
        animate={scrolled ? "scrolled" : "top"}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="pointer-events-auto w-full mx-auto rounded-xl border backdrop-blur-md p-3"
      >
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-2">
            <Link href="/" className="mr-6 flex items-center gap-2 group">
              <FaCube className="size-6 text-neutral-200" />
              <span className="font-bold text-xl tracking-tight text-neutral-200 hidden sm:block">
                Scaffoldor
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {["Templates", "CLI"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                  scroll={false}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-4">
            <div className="h-4 w-px bg-neutral-800" />
            <a
              href="https://github.com/itstheanurag/scaffoldor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              <BsStar size={16} />
              Star on GitHub
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-neutral-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <BiX size={24} /> : <BiMenu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-40 rounded-xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-2xl backdrop-blur-md md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-4">
              {["Templates", "CLI"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-lg font-medium text-neutral-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              <div className="h-px bg-neutral-900 my-2" />

              <a
                href="https://github.com/itstheanurag/scaffoldor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-sm font-medium text-white"
              >
                <BsStar size={18} />
                Star on GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
