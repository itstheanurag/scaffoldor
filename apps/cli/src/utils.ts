import { simpleGit } from "simple-git";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import inquirer from "inquirer";

const git = simpleGit();

export async function cloneTemplate(url: string, dest: string) {
  console.log(pc.blue(`Cloning template from ${url}...`));
  await git.clone(url, dest);

  const gitDir = path.join(dest, ".git");
  if (await fs.pathExists(gitDir)) {
    await fs.remove(gitDir);
    console.log(pc.green("Removed original .git history."));
  }
}

export async function detectPackageManager(
  dir: string,
): Promise<"npm" | "pnpm" | "yarn" | "bun" | "unknown"> {
  if (await fs.pathExists(path.join(dir, "package-lock.json"))) return "npm";
  if (await fs.pathExists(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (await fs.pathExists(path.join(dir, "yarn.lock"))) return "yarn";
  if (await fs.pathExists(path.join(dir, "bun.lockb"))) return "bun";
  if (await fs.pathExists(path.join(dir, "bun.lock"))) return "bun";
  return "unknown";
}

export async function handlePackageManagerTransition(dir: string) {
  const detected = await detectPackageManager(dir);
  if (detected === "unknown") return;

  const { usePreferred } = await inquirer.prompt([
    {
      type: "list",
      name: "usePreferred",
      message: `Detected ${detected} in template. Which package manager do you want to use?`,
      choices: ["npm", "pnpm", "yarn", "keep original"],
      default: detected,
    },
  ]);

  if (usePreferred !== "keep original" && usePreferred !== detected) {
    console.log(pc.yellow(`Switching from ${detected} to ${usePreferred}...`));
    // Remove old lockfile
    const lockfiles = {
      npm: "package-lock.json",
      bun: "bun.lockb",
      pnpm: "pnpm-lock.yaml",
      yarn: "yarn.lock",
    };
    const oldLockfile = path.join(dir, lockfiles[detected]);
    if (await fs.pathExists(oldLockfile)) {
      await fs.remove(oldLockfile);
    }
  }
}

export async function initNewGitRepo(dir: string) {
  const newGit = simpleGit(dir);
  await newGit.init();
  console.log(pc.green("Initialized new git repository."));
}

export async function updatePackageJson(dir: string, name: string) {
  const pkgPath = path.join(dir, "package.json");
  if (await fs.pathExists(pkgPath)) {
    try {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = name;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      console.log(pc.green(`Updated package.json name to "${name}".`));
    } catch (error) {
      console.warn(
        pc.yellow("Failed to update package.json name. Skipping..."),
      );
    }
  }
}
