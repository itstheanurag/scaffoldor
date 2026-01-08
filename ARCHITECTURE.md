# Scaffoldor Architecture

This document provides a technical overview of the Scaffoldor project architecture.

## Table of Contents

- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [CLI Architecture](#cli-architecture)
- [Web Application](#web-application)
- [Shared Packages](#shared-packages)
- [Data Flow](#data-flow)

## Overview

Scaffoldor is a template management system consisting of:

1. **CLI Tool**: A command-line interface for downloading and managing templates from GitHub/GitLab
2. **Web Directory**: A web application serving as a searchable directory for popular templates
3. **Shared Infrastructure**: Common configurations and components used across packages

```mermaid
┌─────────────────────────────────────────────────────────────┐
│                      Scaffoldor                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │    CLI      │    │   Web App   │    │ Shared Packages │ │
│  │  (Node.js)  │    │  (Next.js)  │    │ (Config/UI)     │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Turborepo (Build System)                 │
└─────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

The project uses [Turborepo](https://turbo.build/repo) for monorepo management with [Bun](https://bun.sh/) as the package manager.

```text
scaffoldor/
├── apps/
│   ├── cli/                    # CLI application
│   │   ├── src/
│   │   │   ├── commands/       # Command implementations (add, list, etc.)
│   │   │   ├── helpers/        # UI and logic helpers
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── registry.ts     # Registry management
│   │   │   └── utils.ts        # Utility functions
│   │   └── package.json
│   │
│   └── web/                    # Web application
│       ├── app/                # Next.js App Router
│       └── package.json
│
├── content/                    # Template definitions (registry source)
│   └── templates/              # JSON files by username
│
├── packages/
│   ├── eslint-config/          # Shared ESLint rules
│   ├── schema/                 # Shared Zod schemas & types
│   ├── typescript-config/      # Shared tsconfig
│   └── ui/                     # Shared React components
│
├── registry/                   # Compiled registry output
│   └── registry.json
│
├── turbo.json                  # Turborepo pipeline config
└── package.json                # Root workspace config
```

### Turborepo Configuration

The `turbo.json` defines the build pipeline:

- **build**: Builds all packages with dependency ordering
- **dev**: Runs development servers (no cache, persistent)
- **lint**: Runs ESLint across packages
- **check-types**: TypeScript type checking

## CLI Architecture

The CLI is built with Node.js and published as the `scaffoldor` npm package.

### Technology Stack

| Component         | Technology                                                 |
| ----------------- | ---------------------------------------------------------- |
| Command parsing   | [Commander.js](https://github.com/tj/commander.js)         |
| User prompts      | [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)    |
| Git operations    | [simple-git](https://github.com/steveukx/git-js)           |
| File operations   | [fs-extra](https://github.com/jprichardson/node-fs-extra)  |
| Schema validation | [Zod](https://github.com/colinhacks/zod)                   |
| Console styling   | [picocolors](https://github.com/alexeyraspopov/picocolors) |
| Build tool        | [tsup](https://github.com/egoist/tsup)                     |

### Command Structure

```text
scaffoldor
├── list                    # List all templates in registry
├── add <slug> <url>        # Add template to local registry
│   ├── --type <type>       # Template type (frontend, backend, etc.)
│   └── --description       # Template description
└── @<slug> [destination]   # Clone template to destination
```

### Core Modules

#### `index.ts` - Entry Point

- Bootstraps the CLI using Commander.js
- Registers commands from `src/commands/`
- Handles global options and versioning

#### `src/commands/` - Command Implementations

- **`list.ts`**: Lists available templates with filtering
- **`search.ts`**: Fuzzy search for templates
- **`scaffold.ts`**: Core logic for cloning and setting up templates
- **`add.ts`**: Interactive wizard to add new templates to local registry
- **`sync.ts`**: Syncs local registry with remote

#### `registry.ts` - Registry Management

- Reads from the centralized `registry.json`
- Provides search and filtering capabilities
- Validates data against `@repo/schema`

#### `helpers/ui.ts` - UI Helpers

- Consistent styling for headers, alerts, and tables
- Centralized error handling and messaging

#### `@repo/schema` - Shared Types

- **`CommunityTemplateSchema`**: Validation for template data
- **`RegistrySchema`**: Validation for the entire registry
- Ensures consistency between CLI and Web App

### Command Internals

#### Registry Synchronization (`sync`)

The `sync` command is designed to minimize latency and provide offline support. It fetches the latest compiled `registry.json` from the remote source and saves it to a local cache.

- **Local Priority**: Once synced, commands like `list` and `scaffold` use this local copy, making operations nearly instantaneous.
- **Offline Mode**: If the remote registry is unreachable, the CLI gracefully falls back to the last successfully cached local data.

#### Adding Templates (`add`)

The `add` command allows users to register templates specifically in their local registry.

- **Local-First Development**: Authors can test their template definitions locally before submitting them to the community registry.
- **Private Templates**: Useful for internal or private templates that shouldn't be shared globally.
- **Validation**: Every added template is validated against the `@repo/schema` before being written to disk.

#### Smart Searching (`search` / `list`)

Scanning the registry is optimized by combining sources:

1. **Local Search**: Scans the locally added and cached templates.
2. **Remote Fallback**: If a template isn't found locally, or if the `--remote` flag is used, the CLI fetches the global registry in real-time.
3. **Merging**: Results are merged with local definitions taking precedence over remote ones if slugs collide.

### CLI Flow Diagram

```text
┌──────────────────────────────────────────────────────────────┐
│                    User runs: scaffoldor @nextjs             │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              Parse slug, lookup in registry.json             │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                Clone repository using simple-git             │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              Remove .git directory from clone                │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│      Detect package manager, prompt for preference           │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              Initialize new git repository                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    ✅ Template ready!                        │
└──────────────────────────────────────────────────────────────┘
```

## Web Application

The web app is built with [Next.js](https://nextjs.org/) using the App Router.

### Web Tech Stack

| Component | Technology     |
| --------- | -------------- |
| Framework | Next.js 16     |
| Styling   | Tailwind CSS 4 |
| Runtime   | React 19       |

### Purpose

The web application serves as:

1. **Template Directory**: A searchable catalog of popular templates
2. **Template Discovery**: Browse and discover community templates
3. **Voting/Likes**: (Planned) Allow users to upvote favorite templates

### Structure

```text
apps/web/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
└── public/             # Static assets
```

## Shared Packages

### `@repo/eslint-config`

Shared ESLint configuration including:

- Next.js specific rules
- Prettier integration
- TypeScript support

### `@repo/typescript-config`

Base TypeScript configurations:

- Strict mode enabled
- Common compiler options
- Path aliases

### `@repo/schema`

Shared data validation source:

- **Zod Schemas**: Runtime validation for templates and registry
- **TypeScript Types**: Inferred static types
- **Single Source of Truth**: Used by CLI (input/output) and Web (display)

### `@repo/ui`

Shared React component library:

- Reusable UI components
- Consistent styling
- Used by web app

## Data Flow

### Template Registry

The registry is built from the source of truth in `content/templates`:

```mermaid
┌──────────────────────┐      Build Script      ┌──────────────────┐
│  content/templates/  │ ─────────────────────► │  registry.json   │
│  (Source of Truth)   │   (scripts/build.ts)   │ (Compiled Data)  │
└──────────────────────┘                        └────────┬─────────┘
                                                         │
                                        ┌────────────────┴────────────────┐
                                        │                                 │
                                        ▼                                 ▼
                                 ┌─────────────┐                   ┌─────────────┐
                                 │     CLI     │                   │   Web App   │
                                 │ (Read-Only) │                   │ (Read-Only) │
                                 └─────────────┘                   └─────────────┘
```

### Future: Centralized Registry

Planned architecture with web-hosted registry:

```mermaid
┌─────────────┐                     ┌──────────────────┐
│   CLI       │ ◄──── fetch ─────── │   Web API        │
└─────────────┘                     └────────┬─────────┘
                                             │
┌─────────────┐                              │
│   Web App   │ ◄──── fetch ─────────────────┘
└─────────────┘                              │
                                             ▼
                                    ┌──────────────────┐
                                    │    Database      │
                                    └──────────────────┘
```

## Build & Development

### Build Pipeline

```bash
# Full build
turbo build

# Development (all apps)
turbo dev

# Type checking
turbo check-types

# Linting
turbo lint
```

### Package Dependency Graph

```text
┌─────────────────────────────────────────────────────────────┐
│                         apps/cli                            │
│                    (no internal deps)                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         apps/web                            │
│                            │                                │
│                            ▼                                │
│                       packages/ui                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    All Packages                             │
│                          │                                  │
│             ┌────────────┴────────────┐                     │
│             ▼                         ▼                     │
│   packages/eslint-config    packages/typescript-config      │
└─────────────────────────────────────────────────────────────┘
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.
