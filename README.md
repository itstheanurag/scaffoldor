<p align="center">
  <h1 align="center">Scaffoldor</h1>
  <p align="center">
    <strong>A CLI tool for downloading and sharing GitHub/GitLab templates</strong>
  </p>
  <p align="center">
    Stop bookmarking template URLs. Start scaffolding with a single command.
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Features

- **One-command scaffolding** - Clone any template with `scaffoldor @template-name`
- **Personal registry** - Save your favorite templates locally for quick access
- **Package manager flexibility** - Automatically detects and lets you switch between npm, pnpm, yarn, or bun
- **Clean starts** - Removes original git history and initializes a fresh repo
- **Template directory** - Browse and discover popular templates (coming soon)

## Installation

```bash
# Using npm
npm install -g scaffoldor

# Using bun
bun install -g scaffoldor

# Using pnpm
pnpm install -g scaffoldor

# Using yarn
yarn global add scaffoldor
```

## Quick Start

```bash
# Add a template from the registry
scaffoldor add @nextjs-starter

# Add with a specific package manager
scaffoldor add @express-api --pm bun

# List all available templates
scaffoldor list
```

## Usage

### Add a Template

Add a template from the centralized registry to your project:

```bash
scaffoldor add @<template-name> [options]
```

**Options:**

- `--pm <manager>` - Package manager to use (`npm`, `pnpm`, or `bun`)

**Examples:**

```bash
# Add a Next.js template
scaffoldor add @nextjs-basic

# Add with a specific package manager
scaffoldor add @express-api --pm pnpm

# Add using bun and current directory
scaffoldor add @fullstack-starter . --pm bun

# paste template inside a directory
scaffoldor add @fullstack-starter test-app --pm bun

```

### List Templates

Browse all available templates in the registry:

```bash
scaffoldor list
```

**Output:**

```
Available Templates:
@nextjs-basic [frontend] - Basic Next.js starter
@express-api [backend] - Express.js REST API starter
@fullstack-starter [fullstack] - Full-stack TypeScript template
```

## How It Works

1. **Centralized Registry**: Templates are curated in a community registry
2. **Browse & Discover**: Use `list` to browse available templates
3. **One-command Add**: Run `scaffoldor add @template-name` to scaffold
4. **Package Manager**: Choose npm, pnpm, or bun with the `--pm` flag
5. **Clean Slate**: Fresh project with your preferred setup

## Roadmap

- [ ] **Centralized registry** - Community-curated template directory
- [ ] **Template search** - Search templates directly from CLI
- [ ] **Likes/ratings** - Discover popular templates
- [ ] **Template updates** - Check for and apply template updates
- [ ] **Custom registries** - Connect to private/enterprise registries

## Project Structure

This is a monorepo containing:

| Package | Description |
|---------|-------------|
| `apps/cli` | The scaffoldor CLI tool |
| `apps/web` | Web application for template directory |
| `packages/ui` | Shared React components |
| `packages/eslint-config` | Shared ESLint configuration |
| `packages/typescript-config` | Shared TypeScript configuration |

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Development setup
- Project structure
- Contribution guidelines
- Code style

For technical details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## License

MIT © Scaffoldor Contributors

---

<p align="center">
  Made with for developers who love efficiency
</p>
