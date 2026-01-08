import pc from "picocolors";
import { CommunityTemplate } from "@repo/schema";

export const UI = {
  header: (text: string) => console.log(pc.cyan(`\n${text}\n`)),

  success: (text: string) => console.log(pc.green(`\n✅ ${text}`)),

  error: (text: string) => console.log(pc.red(`\n❌ Error: ${text}`)),

  warn: (text: string) => console.log(pc.yellow(`\n⚠ ${text}`)),

  info: (text: string) => console.log(pc.blue(text)),

  dim: (text: string) => console.log(pc.dim(text)),

  templateItem: (t: CommunityTemplate) => {
    const authorPrefix = t.author.github ? `@${t.author.github}/` : "";
    const name = pc.bold(pc.cyan(`${authorPrefix}${t.slug}`));

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

  scaffoldSuccess: (slug: string, dest: string, url: string) => {
    UI.success(`Successfully scaffolded @${slug} into ${dest}`);

    console.log(pc.dim("\nNext steps:"));
    console.log(pc.cyan(`  cd ${dest}`));
    console.log(pc.cyan(`  bun install`));
    console.log(pc.cyan(`  bun dev`));

    console.log(pc.yellow("\n⭐ Like this template? Star it on GitHub:"));
    console.log(pc.blue(`   ${url}\n`));
  },
};
