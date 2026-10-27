<p align="center">
  <h1 align="center">Scaffoldor</h1>
  <p align="center">
    <strong>Scaffold new projects from GitHub or GitLab templates in one command.</strong>
  </p>
  <p align="center">
    Stop bookmarking template URLs. Start building.
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#commands">Commands</a> •
  <a href="#web-app">Web App</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Features

- **One-command scaffolding** — `scaffoldor @author/template my-app`
- **GitHub, GitLab, and custom Git hosts** — including branch and subdirectory URLs
- **Clean starts** — keep the original history, create a fresh repository, or remove git entirely
- **Package manager aware** — detects npm, pnpm, yarn, and bun, and can switch the template to your preferred manager
- **Community registry** — search and list curated templates, with a local cache for offline use
- **Private/local templates** — add your own templates under `@local` and keep them across registry syncs
- **Scriptable** — `--json` output, non-interactive flags, and no prompts in CI

## Installation

```bash
# npm
npm install -g scaffoldor

# pnpm
pnpm add -g scaffoldor

# yarn
yarn global add scaffoldor

# bun
bun add -g scaffoldor
```

Requires Node.js 18 or newer. No installation is required to try it:

```bash
npx scaffoldor list --remote
```

## Quick Start

```bash
# Scaffold a template into a new directory
npx scaffoldor @itstheanurag/nest-backend my-api

# Browse the registry
npx scaffoldor list --remote

# Search by name, tag, or author
npx scaffoldor search postgres

# Refresh the local registry cache
npx scaffoldor sync
```

Templates can be referenced as `@author/slug`, `author/slug`, or a bare `slug`
when the slug is unique.

## Commands

| Command                             | Description                                   |
| ----------------------------------- | --------------------------------------------- |
| `scaffoldor <slug> [dest]`          | Scaffold a template (default command)         |
| `scaffoldor scaffold <slug> [dest]` | Explicit form of the same command             |
| `scaffoldor list`                   | List templates in the local cache             |
| `scaffoldor search <query>`         | Search local and remote templates             |
| `scaffoldor sync`                   | Download the latest community registry        |
| `scaffoldor add <slug> <url>`       | Add or update a local template under `@local` |

### Scaffold options

| Option                 | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `-g, --git <strategy>` | `keep` original history, `fresh` repository, or `remove` git |
| `-p, --pm <manager>`   | `npm`, `pnpm`, `yarn`, or `bun`                              |
| `-f, --force`          | Allow writing into a non-empty destination                   |
| `-y, --yes`            | Skip prompts and use defaults                                |

```bash
# Non-interactive setup for CI or scripts
scaffoldor @ayushchugh/backend my-api --git fresh --pm pnpm --yes

# Scaffold into the current (empty) directory
scaffoldor @ayushchugh/webapp .

# Add files to an existing directory (explicit opt-in)
scaffoldor @ayushchugh/webapp ./existing --force

# Use a repository URL directly (branches and subdirectories supported)
scaffoldor https://github.com/owner/repo/tree/main/apps/web my-app
```

Without `--git`, the CLI prompts when running in a terminal and uses `fresh`
when it is not interactive.

### List and search

```bash
# Local cache only
scaffoldor list

# Include the remote registry
scaffoldor list --remote

# Filter by type, framework, or author
scaffoldor list --type backend --framework nestjs
scaffoldor list --author itstheanurag

# Machine-readable output
scaffoldor list --remote --json
scaffoldor search nextjs --json
```

### Local templates

`scaffoldor add` writes to your local registry rather than the community one,
so private or work-in-progress templates stay on your machine:

```bash
scaffoldor add my-starter https://github.com/me/my-starter --type fullstack
scaffoldor @local/my-starter ./scratch
```

Local templates survive `scaffoldor sync`; corrupt local registries are backed
up and rebuilt automatically.

## Web App

The `apps/web` package is the template directory at
[scaffoldor.vercel.app](https://scaffoldor.vercel.app). It:

- Lists every template in the registry with search and stack filters
- Documents each template and its exact scaffold command
- Generates a sitemap and structured data from `registry/registry.json`

Run it locally with:

```bash
bun install
bun run dev
```

## Project Structure

This is a monorepo containing:

| Path                        | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `apps/cli`                  | The `scaffoldor` CLI (published to npm)                    |
| `apps/web`                  | Next.js template directory                                 |
| `packages/schema`           | Zod schemas shared by the CLI, web app, and registry build |
| `content/templates`         | Community template submissions                             |
| `registry/registry.json`    | Compiled registry consumed by the CLI and web app          |
| `scripts/build-registry.ts` | Validates submissions and builds the registry              |

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Development setup
- Project structure
- Contribution guidelines
- Code style

To submit a template, follow
[content/templates/CONTRIBUTING.md](./content/templates/CONTRIBUTING.md).

For technical details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## License

Apache-2.0 © Scaffoldor Contributors

---

<p align="center">
  Made for developers who love shipping.
</p>
