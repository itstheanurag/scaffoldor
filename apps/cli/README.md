# 🏗️ Scaffoldor CLI

[![npm version](https://img.shields.io/npm/v/scaffoldor.svg)](https://www.npmjs.com/package/scaffoldor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Scaffoldor** is a powerful community-driven CLI tool designed to streamline the process of starting new projects by providing a centralized registry of production-ready templates. Stop wasting time hunting for your favorite starter kits—bring them all into one place.

---

## 🌟 Features

- **🚀 Instant Scaffolding**: Download and initialize templates from GitHub/GitLab in seconds.
- **👥 Community Registry**: Access a curated list of templates shared by the community.
- **🏷️ Scoped Templates**: Find templates using the intuitive `@username/template` format.
- **🔍 Powerful Search**: Discover templates by name, framework, type, or author.
- **📦 Local Registry**: Add your own custom private or public templates to your local machine.
- **⚡ Built for Speed**: Native support for Bun, with seamless fallback for Node.js environments.

---

## 💻 Installation

```bash
# Using Bun (Recommended)
bun add -g scaffoldor

# Using npm
npm install -g scaffoldor

# Using yarn
yarn global add scaffoldor
```

---

## 🚀 Quick Start

Start a new project in two commands:

```bash
# 1. Sync the latest community registry
scaffoldor sync

# 2. Scaffold a template
scaffoldor @owner/nextjs-starter ./my-new-app
```

---

## 📖 Comprehensive Usage Guide

### 1. Scaffolding Templates

The core command for starting a new project. Supported formats include `@username/slug` and `username/slug`.

```bash
# Basic usage
scaffoldor @ayushchug/backend

# Specify destination directory
scaffoldor ayushchug/webapp ./projects/my-app
```

### 2. Discovering Templates

Explore the local and remote registries to find the perfect starter for your next project.

```bash
# List all templates in your local cache
scaffoldor list

# List all templates in the remote community registry
scaffoldor list --remote

# Filter by author
scaffoldor list -a ayushchug

# Filter by type and framework
scaffoldor list --type frontend --framework nextjs
```

### 3. Searching for Specific Needs

Search through descriptions, tags, and names to find exactly what you need.

```bash
# Basic search
scaffoldor search react

# Search within a specific author's portfolio
scaffoldor search starter -a ayushchug
```

### 4. Registry Management

Keep your templates up to date or add your own to your personal collection.

```bash
# Sync with the community registry
scaffoldor sync

# Add a local shortcut for a private or unlisted template
scaffoldor add my-private-kit https://github.com/me/private-kit --type fullstack
```

---

## 🤔 When to Use Scaffoldor?

### ✅ Use it when:

- **Consistent Starters**: You frequently start new projects and want a consistent foundation.
- **Team Standards**: You want to share "golden path" templates across your organization or team.
- **Community Discovery**: You want to explore high-quality starters from the community without searching GitHub manually.
- **Modular Repos**: You manage a monorepo or collection of templates and want a single point of entry.

### ❌ Don't use it when:

- **One-off Prototyping**: If you just need to clone a repo once and never touch it again, a standard `git clone` is faster.
- **Complex Environment Setup**: Scaffoldor handles the code and repo initialization, but it is not an environment manager (like Docker or Nix).

---

## 📂 Template Metadata Structure

Templates in the registry include rich metadata to help you choose:

- **Type**: `frontend`, `backend`, `fullstack`, `mobile`, `cli`, `library`.
- **Framework**: Support for React, Next.js, Hono, Elysia, Astro, SvelteKit, and many more.
- **Features**: List of included features like Auth, Database, API Routes, etc.

---

## 🤝 Contributing

We love contributions! If you have a template you'd like to share:

1. Visit the [Scaffoldor Registry](https://github.com/itstheanurag/scaffoldor) repository.
2. Follow the instructions in `CONTRIBUTING.md` to add your JSON entry.
3. Open a Pull Request!

---

## 📄 License

MIT © [Anurag](https://github.com/itstheanurag)
