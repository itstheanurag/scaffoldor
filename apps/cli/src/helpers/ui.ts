import pc from "picocolors";
import { TemplateWithUsername } from "../types";
import type { PackageManager } from "../utils";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: "npm install",
  pnpm: "pnpm install",
  yarn: "yarn",
  bun: "bun install",
};

const DEV_COMMANDS: Record<PackageManager, string> = {
  npm: "npm run dev",
  pnpm: "pnpm dev",
  yarn: "yarn dev",
  bun: "bun dev",
};

export const UI = {
  header: (text: string) => console.log(pc.cyan(`\n${text}\n`)),

  success: (text: string) => console.log(pc.green(`\n✅ ${text}`)),

  warn: (text: string) => console.error(pc.yellow(`\n⚠ ${text}`)),

  // Errors and warnings go to stderr so `--json` stdout stays machine-readable.
  error: (text: string) => console.error(pc.red(`\n❌ Error: ${text}`)),

  info: (text: string) => console.log(pc.blue(text)),

  dim: (text: string) => console.log(pc.dim(text)),

  templateItem: (t: TemplateWithUsername) => {
    const name = pc.bold(pc.cyan(`@${t.username}/${t.slug}`));

    const tierBadge =
      t.tier === "premium" ? pc.yellow(" [PREMIUM]") : pc.green(" [FREE]");

    const typeBadge = pc.dim(`[${t.type}]`);
    const frameworkBadge =
      t.framework !== "other" ? pc.blue(` (${t.framework})`) : "";

    console.log(`${name}${tierBadge}`);
    console.log(
      `${typeBadge}${frameworkBadge} ${t.description || "No description"}`,
    );

    if (t.tags.length > 0) {
      console.log(`Tags: ${t.tags.map((tag) => pc.magenta(tag)).join(", ")}`);
    }

    if (t.author.name) {
      console.log(
        `${pc.dim("Author:")} ${t.author.name}${t.author.github ? ` (@${t.author.github})` : ""}`,
      );
    }
    console.log("");
  },

  scaffoldSuccess: (
    slug: string,
    dest: string,
    url: string,
    packageManager: PackageManager | "unknown",
  ) => {
    UI.success(`Successfully scaffolded @${slug} into ${dest}`);

    const manager = packageManager === "unknown" ? "npm" : packageManager;
    const installCommand =
      packageManager === "unknown"
        ? "install dependencies with your package manager"
        : INSTALL_COMMANDS[manager];
    const devCommand =
      packageManager === "unknown"
        ? "run your dev script"
        : DEV_COMMANDS[manager];

    console.log(pc.dim("\nNext steps:"));
    console.log(pc.cyan(`  cd ${dest}`));
    console.log(pc.cyan(`  ${installCommand}`));
    console.log(pc.cyan(`  ${devCommand}`));

    try {
      const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
      if (host === "github.com" || host.endsWith(".github.com")) {
        console.log(pc.yellow("\n⭐ Like this template? Star it on GitHub:"));
        console.log(pc.blue(`   ${url}\n`));
      } else if (host === "gitlab.com" || host.endsWith(".gitlab.com")) {
        console.log(pc.yellow("\n⭐ Like this template? Star it on GitLab:"));
        console.log(pc.blue(`   ${url}\n`));
      } else {
        console.log("");
      }
    } catch {
      console.log("");
    }
  },
};
