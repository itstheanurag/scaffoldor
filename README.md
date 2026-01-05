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

## ✨ Features

- 🚀 **One-command scaffolding** - Clone any template with `scaffoldor @template-name`
- 📚 **Personal registry** - Save your favorite templates locally for quick access
- 🔄 **Package manager flexibility** - Automatically detects and lets you switch between npm, pnpm, yarn, or bun
- 🎯 **Clean starts** - Removes original git history and initializes a fresh repo
- 🌐 **Template directory** - Browse and discover popular templates (coming soon)

## 📦 Installation

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

## 🚀 Quick Start

```bash
# Add a template to your registry
scaffoldor add nextjs-starter https://github.com/vercel/next.js/tree/canary/examples/hello-world -t frontend -d "Simple Next.js starter"

# Scaffold the template
scaffoldor @nextjs-starter my-new-project

# List all your saved templates
scaffoldor list
```

## 📖 Usage

### Add a Template

Save a GitHub/GitLab repository as a template in your local registry:

```bash
scaffoldor add <slug> <url> [options]
```

**Options:**
- `-t, --type <type>` - Template type (e.g., `frontend`, `backend`, `fullstack`) - default: `other`
- `-d, --description <desc>` - Template description

**Examples:**
```bash
# Add a Next.js template
scaffoldor add nextjs-basic https://github.com/user/nextjs-template -t frontend

# Add with description
scaffoldor add express-api https://github.com/user/express-starter -t backend -d "Express.js REST API starter"
```

### Scaffold a Template

Clone a saved template to start a new project:

```bash
scaffoldor @<slug> [destination]
```

If no destination is provided, creates a folder named after the slug.

**Examples:**
```bash
# Scaffold to a specific directory
scaffoldor @nextjs-basic my-awesome-app

# Scaffold to current naming convention
scaffoldor @express-api
# Creates ./express-api/
```

### List Templates

View all templates in your registry:

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

1. **Registry**: Templates are stored in a local `registry.json` file
2. **Cloning**: Uses git to clone the repository
3. **Clean slate**: Removes the original `.git` directory
4. **Package manager**: Detects the lock file and prompts for your preferred package manager
5. **Fresh start**: Initializes a new git repository

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
  Made with ❤️ for developers who love efficiency
</p>
