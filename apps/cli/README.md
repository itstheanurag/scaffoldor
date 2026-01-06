# Scaffoldor CLI

> Download templates from GitHub/GitLab with ease

## Installation

```bash
npm install -g scaffoldor
```

## Quick Start

```bash
# Scaffold a template
scaffoldor @nextjs-basic

# Scaffold into a specific directory
scaffoldor @react-starter my-project
```

## Commands

### Scaffold a Template

```bash
scaffoldor @<slug> [destination]
```

Downloads and scaffolds a template into the specified directory (or a folder named after the slug).

### List Templates

```bash
scaffoldor list [options]

Options:
  -r, --remote              Include templates from remote registry
  -t, --type <type>         Filter by type (frontend, backend, fullstack, etc.)
  -f, --framework <fw>      Filter by framework
```

### Search Templates

```bash
scaffoldor search <query> [options]

Options:
  -t, --type <type>         Filter by type
  -f, --framework <fw>      Filter by framework
```

### Sync Registry

```bash
scaffoldor sync
```

Syncs templates from the remote registry to your local cache.

### Add Local Template

```bash
scaffoldor add <slug> <url> [options]

Options:
  -t, --type <type>           Template type (default: "other")
  -f, --framework <fw>        Template framework (default: "other")
  -d, --description <desc>    Template description
  --tags <tags>               Comma-separated tags
  --features <features>       Comma-separated features
```

Adds a custom template to your local registry.

## Template Types

- `frontend` - Frontend applications
- `backend` - Backend/API services
- `fullstack` - Full-stack applications
- `mobile` - Mobile applications
- `cli` - CLI tools
- `library` - Libraries/packages
- `other` - Other templates

## Supported Frameworks

**Frontend:** React, Vue, Svelte, Angular, Next.js, Nuxt, Astro, Solid, Qwik  
**Backend:** Express, Fastify, Hono, Elysia, NestJS, Koa  
**Fullstack:** Remix, SvelteKit  
**Mobile:** React Native, Expo, Flutter

## License

MIT
