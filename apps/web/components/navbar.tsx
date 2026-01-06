import Link from "next/link";
import { FaCube, FaGithub } from "react-icons/fa";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="container mx-auto flex h-14 items-center max-w-7xl px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <FaCube className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">scaffoldor</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#templates"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Templates
            </Link>
            <Link
              href="#cli"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              CLI
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search Placeholder if needed */}
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="https://github.com/itstheanurag/scaffoldor"
              target="_blank"
              rel="noreferrer"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 bg-transparent px-0 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <FaGithub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
