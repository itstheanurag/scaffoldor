import { CliOutputShowcase } from "./cli";
import { StepsShowcase } from "./steps";

export function CliShowcase() {
  return (
    <section id="cli" className="container mx-auto py-12 md:py-24 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
            Trustworthy by design.
          </h2>
          <p className="max-w-[600px] text-neutral-400 lg:text-base">
            The CLI handles the dirty work of cloning and setting up your
            project, ensuring you start with a clean slate every time.
          </p>
          <StepsShowcase />
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-[500px] overflow-hidden rounded-xl bg-neutral-950 shadow-2xl border border-neutral-800 ring-1 ring-white/10">
            <div className="flex items-center gap-2 bg-neutral-950 px-4 py-3 border-b border-neutral-800">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div className="ml-2 text-xs text-neutral-500 font-mono">
                scaffoldor-cli — 80x24
              </div>
            </div>
            <CliOutputShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
