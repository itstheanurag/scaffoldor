# Scaffoldor CLI

[![npm version](https://img.shields.io/npm/v/scaffoldor.svg)](https://www.npmjs.com/package/scaffoldor)
[![npm downloads](https://img.shields.io/npm/dm/scaffoldor.svg)](https://www.npmjs.com/package/scaffoldor)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/node/v/scaffoldor.svg)](https://nodejs.org/)

**Scaffold new projects from GitHub or GitLab templates with a single command.**

Scaffoldor is a community-driven template registry and CLI. Discover a
template, clone it into a clean project, choose how git and your package
manager should be handled, and start building.

## Features

- **One-command scaffolding** — `scaffoldor @author/template my-app`
- **GitHub, GitLab, and custom Git hosts** — including URLs that point at a
  branch or subdirectory.
- **Clean starts** — keep the original history, create a fresh repository, or
  remove git entirely.
- **Package manager aware** — detects npm, pnpm, yarn, and bun, and can switch
  the template to your preferred manager.
- **Community registry** — search and list curated templates, with a local
  cache for offline use.
- **Private/local templates** — add your own templates under `@local` and keep
  them across registry syncs.
- **Scriptable** — `--json` output, non-interactive flags, and no prompts in CI.

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

## Quick start

```bash
# Refresh the community registry (optional; commands can fetch remotely)
scaffoldor sync

# Browse templates
scaffoldor list --remote

# Scaffold one
scaffoldor @itstheanurag/nest-backend my-app
```

## Commands

| Command                             | Description                                     |
| ----------------------------------- | ----------------------------------------------- |
| `scaffoldor <slug> [dest]`          | Scaffold a template (default command)           |
| `scaffoldor scaffold <slug> [dest]` | Explicit form of the same command               |
| `scaffoldor list`                   | List templates in the local cache               |
| `scaffoldor search <query>`         | Search local and remote templates               |
| `scaffoldor sync`                   | Download the latest community registry          |
| `scaffoldor add <slug> <url>`       | Add or update a template in your local registry |

Templates can be referenced as `@author/slug`, `author/slug`, or a bare `slug`
when the slug is unique.

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
scaffoldor list --author @ravixstudio

# Search names, descriptions, tags, features, and authors
scaffoldor search postgres
scaffoldor search nextjs --type fullstack

# Machine-readable output
scaffoldor list --remote --json
scaffoldor search hono --json
```

`--author` accepts both the registry username (for example `ayushchugh`) and
the author's GitHub handle (for example `ravixstudio`).

### Add a local template

```bash
scaffoldor add my-private-kit https://github.com/me/private-kit \
  --type fullstack \
  --framework nextjs \
  --description "Internal starter" \
  --tags "typescript,auth,drizzle" \
  --features "rbac,data-tables"

# Local templates are stored under @local
scaffoldor @local/my-private-kit ./my-app
```

Local templates survive `scaffoldor sync`. Invalid slugs, URLs, types, and
frameworks are rejected before anything is written, so a typo cannot corrupt
your registry.

### Sync

```bash
scaffoldor sync
```

Sync replaces the cached community templates with the latest remote registry
and preserves templates you added under `@local`. If the local registry file
is ever corrupt, Scaffoldor backs it up and starts from a clean registry
instead of crashing.

## Template URL formats

```text
https://github.com/owner/repo
https://github.com/owner/repo/tree/main
https://github.com/owner/repo/tree/main/apps/web
https://gitlab.com/group/subgroup/repo
https://gitlab.com/group/subgroup/repo/-/tree/main/packages/app
```

`git@github.com:owner/repo.git` and `ssh://git@github.com/owner/repo.git` are
accepted by `add` and normalised to HTTPS. `file://` URLs are supported for
local testing and private offline repositories.

## Environment variables

| Variable                      | Purpose                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| `SCAFFOLDOR_HOME`             | Override the local data directory (default `~/.scaffoldor`) |
| `SCAFFOLDOR_REGISTRY_URL`     | Use a custom registry JSON URL                              |
| `SCAFFOLDOR_REGISTRY_TIMEOUT` | Registry request timeout in milliseconds (default `15000`)  |
| `SCAFFOLDOR_DEBUG`            | Print stack traces for unexpected errors                    |

## Troubleshooting

**The registry is empty.** Run `scaffoldor sync` or use
`scaffoldor list --remote`.

**A template is not found.** Run `scaffoldor search <query>` or use the full
`@author/slug` form. Use `scaffoldor list --remote -a <author>` to list an
author's templates.

**Cloning fails with an authentication error.** The template repository is
private or has been moved. Make sure your local git credentials can clone the
URL directly.

**The local registry was invalid.** Scaffoldor prints the backup path and
starts with an empty registry. Running `scaffoldor sync` restores the community
templates.

**Prompts are skipped.** Prompts only run in an interactive terminal. Use
`--git` and `--pm` to set values explicitly in CI.

## Contributing templates

The community registry lives in
[`content/templates`](https://github.com/itstheanurag/scaffoldor/tree/main/content/templates).
Add your template's JSON file and open a pull request. See the
[template contribution guide](https://github.com/itstheanurag/scaffoldor/blob/main/content/templates/CONTRIBUTING.md).

## Links

- [Website and template directory](https://scaffoldor.vercel.app)
- [Source code](https://github.com/itstheanurag/scaffoldor)
- [Issues](https://github.com/itstheanurag/scaffoldor/issues)
- [Changelog](./CHANGELOG.md)

## License

Apache-2.0 © Scaffoldor Contributors
