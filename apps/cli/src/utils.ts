import { simpleGit } from "simple-git";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import inquirer from "inquirer";
import { CliError } from "./helpers/errors";
import { canPrompt } from "./helpers/prompt";

export type GitStrategy = "keep" | "fresh" | "remove";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export const GIT_STRATEGIES: GitStrategy[] = ["keep", "fresh", "remove"];
export const PACKAGE_MANAGERS: PackageManager[] = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
];

export function isGitStrategy(value: string): value is GitStrategy {
  return GIT_STRATEGIES.includes(value as GitStrategy);
}

export function isPackageManager(value: string): value is PackageManager {
  return PACKAGE_MANAGERS.includes(value as PackageManager);
}

/**
 * A template URL can point at a repository root, a GitHub/GitLab tree URL, or
 * a branch. `git clone` only understands repository roots, so tree URLs are
 * split into a clone URL plus the branch/subdirectory to extract.
 */
export interface TemplateSource {
  cloneUrl: string;
  branch?: string;
  subdir?: string;
}

function toHttpsGitUrl(input: string): string {
  const value = input.trim();

  // git@github.com:owner/repo.git
  const scpLike = value.match(/^git@([^:]+):(.+)$/);
  if (scpLike) {
    return `https://${scpLike[1]}/${scpLike[2]}`;
  }

  // ssh://git@github.com/owner/repo.git
  if (value.startsWith("ssh://")) {
    try {
      const sshUrl = new URL(value);
      if (sshUrl.hostname) {
        return `https://${sshUrl.hostname}${sshUrl.pathname}${sshUrl.search}`;
      }
    } catch {
      // Fall through to the generic error below.
    }
  }

  return value;
}

/**
 * Normalise a user supplied repository URL. SSH GitHub/GitLab URLs are
 * converted to HTTPS so they can be stored in the registry and rendered as
 * links on the website.
 */
export function normalizeRepoUrl(input: string): string {
  const normalized = toHttpsGitUrl(input);

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    throw new CliError(`Invalid repository URL: ${input}`);
  }

  if (
    url.protocol !== "https:" &&
    url.protocol !== "http:" &&
    url.protocol !== "file:"
  ) {
    throw new CliError(
      `Unsupported repository URL: ${input}\nOnly http(s) and file Git URLs are supported.`,
    );
  }

  if (url.protocol !== "file:" && !url.hostname) {
    throw new CliError(`Invalid repository URL: ${input}`);
  }

  // A bare repo URL with a .git suffix is valid for cloning but is noisy in
  // the registry and on the website.
  if (/\/[^/]+\/[^/]+\.git\/?$/.test(url.pathname)) {
    url.pathname = url.pathname.replace(/\.git\/?$/, "");
  }

  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export function parseTemplateSource(input: string): TemplateSource {
  const url = new URL(normalizeRepoUrl(input));
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const segments = url.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });

  const cloneRoot = (repoSegments: string[]) => {
    const repoPath = repoSegments.join("/").replace(/\.git$/, "");
    return `${url.protocol}//${url.host}/${repoPath}.git`;
  };

  // GitLab tree URLs look like:
  // https://gitlab.com/group/subgroup/repo/-/tree/main/packages/app
  const dashIndex = segments.indexOf("-");
  if (dashIndex > 0 && segments[dashIndex + 1] === "tree") {
    const branch = segments[dashIndex + 2];
    const subdirSegments = segments.slice(dashIndex + 3);
    return {
      cloneUrl: cloneRoot(segments.slice(0, dashIndex)),
      branch,
      subdir: subdirSegments.length > 0 ? subdirSegments.join("/") : undefined,
    };
  }

  if (dashIndex > 0 && segments[dashIndex + 1] === "blob") {
    throw new CliError(
      "Template URLs must point to a repository or a directory, not a single file.",
    );
  }

  // GitHub/GitHub Enterprise tree URLs:
  // https://github.com/owner/repo/tree/main/packages/app
  if (segments.length >= 3 && segments[2] === "tree") {
    const branch = segments[3];
    const subdirSegments = segments.slice(4);
    return {
      cloneUrl: cloneRoot(segments.slice(0, 2)),
      branch,
      subdir: subdirSegments.length > 0 ? subdirSegments.join("/") : undefined,
    };
  }

  if (segments.length >= 3 && segments[2] === "blob") {
    throw new CliError(
      "Template URLs must point to a repository or a directory, not a single file.",
    );
  }

  // Plain repository URL (use the URL as-is for self-hosted Git servers
  // whose path layout is not owner/repo).
  const isGitHub = host === "github.com" || host.endsWith(".github.com");
  const isGitLab = host === "gitlab.com" || host.endsWith(".gitlab.com");

  if (isGitLab && segments.length >= 2) {
    // GitLab repositories may live in nested groups.
    return { cloneUrl: cloneRoot(segments) };
  }

  if (isGitHub && segments.length >= 2) {
    return { cloneUrl: cloneRoot(segments.slice(0, 2)) };
  }

  return { cloneUrl: normalizeRepoUrl(input) };
}

async function cloneRepository(
  source: TemplateSource,
  targetDir: string,
  gitStrategy: GitStrategy,
): Promise<void> {
  const options: string[] = [];

  if (source.branch) {
    options.push("--branch", source.branch, "--single-branch");
  }

  // Keeping the original history requires a full clone.
  if (gitStrategy !== "keep") {
    options.push("--depth", "1");
  }

  try {
    await simpleGit().clone(source.cloneUrl, targetDir, options);
  } catch (error) {
    const detail =
      error instanceof Error && error.message
        ? `\n${error.message.split("\n")[0]}`
        : "";
    throw new CliError(
      `Failed to clone ${source.cloneUrl}. Check that the repository exists and that you have access to it.${detail}`,
    );
  }
}

/**
 * Clone a template into an empty destination directory. Tree URLs are
 * supported by cloning the repository and copying only the requested
 * subdirectory into place.
 */
export async function cloneTemplate(
  url: string,
  dest: string,
  gitStrategy: GitStrategy = "fresh",
): Promise<void> {
  const source = parseTemplateSource(url);

  console.log(pc.blue(`Cloning template from ${source.cloneUrl}...`));
  if (source.branch) {
    console.log(pc.dim(`Using branch: ${source.branch}`));
  }
  if (source.subdir) {
    console.log(pc.dim(`Using subdirectory: ${source.subdir}`));
    const repoDir = path.join(dest, ".scaffoldor-repo");
    await cloneRepository(source, repoDir, gitStrategy);

    const sourceDir = path.resolve(repoDir, source.subdir);
    const relative = path.relative(repoDir, sourceDir);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new CliError(`Invalid template subdirectory: ${source.subdir}`);
    }

    if (!(await fs.pathExists(sourceDir))) {
      throw new CliError(
        `Template subdirectory "${source.subdir}" does not exist in ${source.cloneUrl}.`,
      );
    }

    await fs.copy(sourceDir, dest, { overwrite: true });

    if (gitStrategy === "keep") {
      const gitDir = path.join(repoDir, ".git");
      if (await fs.pathExists(gitDir)) {
        await fs.copy(gitDir, path.join(dest, ".git"));
      }
    }

    await fs.remove(repoDir);
  } else {
    await cloneRepository(source, dest, gitStrategy);
  }

  const gitDir = path.join(dest, ".git");
  if (gitStrategy === "keep") {
    if (await fs.pathExists(gitDir)) {
      console.log(pc.green("Kept original git history."));
    }
    return;
  }

  if (await fs.pathExists(gitDir)) {
    await fs.remove(gitDir);
    console.log(pc.green("Removed original .git history."));
  }
}

export async function detectPackageManager(
  dir: string,
): Promise<PackageManager | "unknown"> {
  if (await fs.pathExists(path.join(dir, "package-lock.json"))) return "npm";
  if (await fs.pathExists(path.join(dir, "npm-shrinkwrap.json"))) return "npm";
  if (await fs.pathExists(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (await fs.pathExists(path.join(dir, "yarn.lock"))) return "yarn";
  if (await fs.pathExists(path.join(dir, "bun.lockb"))) return "bun";
  if (await fs.pathExists(path.join(dir, "bun.lock"))) return "bun";

  // Some templates declare their package manager in package.json instead of
  // committing a lockfile.
  const pkgPath = path.join(dir, "package.json");
  if (await fs.pathExists(pkgPath)) {
    try {
      const pkg = await fs.readJson(pkgPath);
      const declared = String(pkg.packageManager ?? "").split("@")[0] ?? "";
      if (isPackageManager(declared)) return declared;
    } catch {
      // Ignore an invalid package.json here; updatePackageJson reports it.
    }
  }

  return "unknown";
}

const LOCKFILES: Record<PackageManager, string[]> = {
  npm: ["package-lock.json", "npm-shrinkwrap.json"],
  pnpm: ["pnpm-lock.yaml"],
  yarn: ["yarn.lock"],
  bun: ["bun.lock", "bun.lockb"],
};

async function removeLockfiles(
  dir: string,
  manager: PackageManager,
): Promise<void> {
  for (const lockfile of LOCKFILES[manager]) {
    await fs.remove(path.join(dir, lockfile));
  }
}

async function syncPackageManagerField(
  dir: string,
  previous: PackageManager,
  next: PackageManager,
): Promise<void> {
  const pkgPath = path.join(dir, "package.json");
  if (!(await fs.pathExists(pkgPath))) return;

  try {
    const pkg = await fs.readJson(pkgPath);
    const declared = String(pkg.packageManager ?? "").split("@")[0] ?? "";
    if (declared === previous && previous !== next) {
      delete pkg.packageManager;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }
  } catch {
    // package.json is handled (and reported) by updatePackageJson.
  }
}

export interface PackageManagerResult {
  manager: PackageManager | "unknown";
  changed: boolean;
}

export async function handlePackageManagerTransition(
  dir: string,
  requested?: string,
  options: { yes?: boolean } = {},
): Promise<PackageManagerResult> {
  const detected = await detectPackageManager(dir);

  let requestedManager: PackageManager | undefined;
  if (requested) {
    const normalized = requested.trim().toLowerCase();
    if (!isPackageManager(normalized)) {
      throw new CliError(
        `Invalid package manager "${requested}". Use one of: ${PACKAGE_MANAGERS.join(", ")}.`,
      );
    }
    requestedManager = normalized;
  }

  let selected: PackageManager | "unknown" = requestedManager ?? detected;

  if (!requestedManager && detected !== "unknown" && canPrompt(options)) {
    const answers = await inquirer.prompt<{
      usePreferred: PackageManager | "keep original";
    }>([
      {
        type: "list",
        name: "usePreferred",
        message: `Detected ${detected} in template. Which package manager do you want to use?`,
        choices: [...PACKAGE_MANAGERS, "keep original"],
        default: detected,
      },
    ]);
    selected =
      answers.usePreferred === "keep original"
        ? detected
        : answers.usePreferred;
  }

  if (selected === "unknown" || selected === detected) {
    return { manager: selected, changed: false };
  }

  console.log(pc.yellow(`Switching from ${detected} to ${selected}...`));

  if (detected !== "unknown") {
    await removeLockfiles(dir, detected);
    await syncPackageManagerField(dir, detected, selected);
  }

  return { manager: selected, changed: true };
}

export async function initNewGitRepo(dir: string): Promise<boolean> {
  const newGit = simpleGit(dir);

  try {
    await newGit.init();

    // `git init` may already create `main` (init.defaultBranch). Creating the
    // branch again would throw and skip the initial commit.
    try {
      const status = await newGit.status();
      if (status.current !== "main") {
        await newGit.checkoutLocalBranch("main");
      }
    } catch {
      console.warn(
        pc.yellow("Could not switch to the 'main' branch; using the default."),
      );
    }

    await newGit.add(".");
    await newGit.commit("Initial commit from scaffoldor");
    console.log(pc.green("Initialized new git repository with 'main' branch."));
    return true;
  } catch (error) {
    const detail =
      error instanceof Error ? ` ${error.message.split("\n")[0]}` : "";
    console.warn(
      pc.yellow(
        `Initialized git repository, but the initial commit failed.${detail}\n` +
          "Set git user.name/user.email and commit manually.",
      ),
    );
    return false;
  }
}

/**
 * npm package names must be lowercase and cannot contain spaces. Derive a
 * safe name from the destination folder without rejecting the scaffold.
 */
export function toPackageName(folderName: string): string {
  const name = folderName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "")
    .replace(/-{2,}/g, "-");

  return name || "app";
}

export async function updatePackageJson(
  dir: string,
  name: string,
): Promise<void> {
  const pkgPath = path.join(dir, "package.json");
  if (!(await fs.pathExists(pkgPath))) return;

  try {
    const pkg = await fs.readJson(pkgPath);
    const packageName = toPackageName(name);

    if (pkg.name === packageName) return;

    pkg.name = packageName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    console.log(pc.green(`Updated package.json name to "${packageName}".`));
  } catch {
    console.warn(pc.yellow("Failed to update package.json name. Skipping..."));
  }
}
