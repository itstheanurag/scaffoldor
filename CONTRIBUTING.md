# Contributing to Scaffoldor

Thank you for your interest in contributing to Scaffoldor! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Bun](https://bun.sh/) >= 1.3.3 (package manager)
- [Git](https://git-scm.com/)

### Setting Up the Development Environment

1. **Fork the repository** on GitHub/GitLab

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/scaffoldor.git
   cd scaffoldor
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Build all packages**
   ```bash
   bun run build
   ```

5. **Start development mode**
   ```bash
   bun run dev
   ```

## Project Structure

Scaffoldor is a monorepo managed with [Turborepo](https://turbo.build/repo). Here's an overview:

```
scaffoldor/
├── apps/
│   ├── cli/          # The scaffoldor CLI tool
│   └── web/          # Web application (template directory)
├── packages/
│   ├── eslint-config/      # Shared ESLint configuration
│   ├── typescript-config/  # Shared TypeScript configuration
│   └── ui/                 # Shared UI components
├── turbo.json        # Turborepo configuration
└── package.json      # Root package.json
```

For more details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Development Workflow

### Working on the CLI

```bash
# Navigate to CLI directory
cd apps/cli

# Build the CLI
bun run build

# Run in development mode (with watch)
bun run dev

# Test locally
node ./dist/index.js list
```

To test the CLI globally during development:
```bash
cd apps/cli
bun link
```

### Working on the Web App

```bash
# Navigate to web directory
cd apps/web

# Start development server
bun run dev
```

The web app will be available at `http://localhost:3000`.

### Running Everything Together

From the root directory:
```bash
# Run all apps in development mode
bun run dev

# Build all packages
bun run build

# Lint all packages
bun run lint

# Format code
bun run format
```

## Submitting Changes

### Creating an Issue

Before starting work on a significant change:

1. Check existing issues to avoid duplicates
2. Create a new issue describing:
   - What you want to change
   - Why the change is needed
   - Your proposed approach

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code style guidelines

3. **Test your changes** thoroughly

4. **Commit your changes** using conventional commit messages

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** against the `main` branch

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated tests if applicable
- [ ] Updated documentation if needed
- [ ] All tests pass locally

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Use explicit types where inference isn't clear
- Prefer `const` over `let`

### Formatting

We use Prettier for code formatting. Run before committing:

```bash
bun run format
```

### Linting

We use ESLint for code quality. Check your code with:

```bash
bun run lint
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(cli): add search command for templates
fix(web): resolve template card display issue
docs: update contributing guidelines
chore: upgrade dependencies
```

## Questions?

If you have any questions, feel free to:

- Open an issue
- Start a discussion
- Reach out to the maintainers

Thank you for contributing! 🎉
