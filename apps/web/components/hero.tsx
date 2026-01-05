import Link from "next/link";
import { FaTerminal } from "react-icons/fa";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 min-h-[90vh] flex flex-col items-center justify-center bg-background">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center">
        <div className="space-y-4 max-w-[980px]">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:leading-[1.1]">
            Don't repeat yourself. <br className="hidden md:block" />
            <span className="text-muted-foreground">
              Scaffold your next big idea.
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            A community-driven template registry and CLI tool that handles the
            clean setup, so you can focus on building the future.
          </p>
        </div>

        <div className="flex w-full items-center justify-center space-x-4">
          <Link
            href="#templates"
            className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Browse Templates
          </Link>
          <Link
            href="#cli"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <FaTerminal className="mr-2 h-4 w-4" />
            Install CLI
          </Link>
        </div>
      </div>
    </section>
  );
}
