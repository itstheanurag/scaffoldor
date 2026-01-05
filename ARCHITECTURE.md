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

```
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

```
scaffoldor/
├── apps/
│   ├── cli/                    # CLI application
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point & command definitions
│   │   │   ├── registry.ts     # Registry management
│   │   │   ├── types.ts        # TypeScript types & Zod schemas
│   │   │   └── utils.ts        # Utility functions
│   │   └── package.json
│   │
│   └── web/                    # Web application
│       ├── app/                # Next.js App Router
│       └── package.json
│
├── packages/
│   ├── eslint-config/          # Shared ESLint rules
│   ├── typescript-config/      # Shared tsconfig
│   └── ui/                     # Shared React components
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

| Component | Technology |
|-----------|------------|
| Command parsing | [Commander.js](https://github.com/tj/commander.js) |
| User prompts | [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) |
| Git operations | [simple-git](https://github.com/steveukx/git-js) |
| File operations | [fs-extra](https://github.com/jprichardson/node-fs-extra) |
| Schema validation | [Zod](https://github.com/colinhacks/zod) |
| Console styling | [picocolors](https://github.com/alexeyraspopov/picocolors) |
| Build tool | [tsup](https://github.com/egoist/tsup) |

### Command Structure

```
scaffoldor
├── list                    # List all templates in registry
├── add <slug> <url>        # Add template to registry
│   ├── --type <type>       # Template type (frontend, backend, etc.)
│   └── --description       # Template description
└── @<slug> [destination]   # Clone template to destination
```

### Core Modules

#### `index.ts` - Entry Point

- Defines CLI commands using Commander.js
- Handles command routing
- Provides the `@slug` shorthand syntax for quick scaffolding

#### `registry.ts` - Registry Management

- Reads/writes the local `registry.json` file
- CRUD operations for templates
- Uses Zod for schema validation

```typescript
// Registry structure
{
  "templates": [
    {
      "slug": "nextjs-basic",
      "type": "frontend",
      "url": "https://github.com/user/template",
      "description": "Basic Next.js starter",
      "features": [],
      "tags": [],
      "author": "",
      "license": "MIT"
    }
  ]
}
```

#### `types.ts` - Type Definitions

- Zod schemas for runtime validation
- TypeScript types derived from schemas
- Ensures type safety across the application

#### `utils.ts` - Utilities

- **cloneTemplate**: Clones git repositories and removes `.git` directory
- **detectPackageManager**: Identifies npm/pnpm/yarn/bun from lockfiles
- **handlePackageManagerTransition**: Prompts user for package manager preference
- **initNewGitRepo**: Initializes fresh git repository

### CLI Flow Diagram

```
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

### Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 |
| Styling | Tailwind CSS 4 |
| Runtime | React 19 |

### Purpose

The web application serves as:

1. **Template Directory**: A searchable catalog of popular templates
2. **Template Discovery**: Browse and discover community templates
3. **Voting/Likes**: (Planned) Allow users to upvote favorite templates

### Structure

```
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

### `@repo/ui`

Shared React component library:

- Reusable UI components
- Consistent styling
- Used by web app

## Data Flow

### Template Registry

Currently uses a local `registry.json` file:

```
┌─────────────┐     read/write      ┌──────────────────┐
│   CLI       │ ◄─────────────────► │  registry.json   │
└─────────────┘                     └──────────────────┘
```

### Future: Centralized Registry

Planned architecture with web-hosted registry:

```
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

```
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
