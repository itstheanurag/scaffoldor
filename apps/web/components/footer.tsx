import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950/20 py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-7xl px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
            Built by the community. Licensed under MIT.
          </p>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            Documentation
          </Link>
          <Link
            href="#cli"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            CLI Install
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            Registry Schema
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            <FaGithub className="h-4 w-4 inline-block" /> GitHub
          </Link>
        </nav>
      </div>
    </footer>
  );
}
