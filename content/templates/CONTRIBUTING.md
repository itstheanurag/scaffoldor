# Contributing Templates to Scaffoldor

We welcome community contributions! The registry is organized by username, making it easy to manage your own templates.

## Directory Structure

Templates are stored in the `content/templates` directory, organized by GitHub username:

```
content/templates/
  ├── your-username/
  │   └── index.json
```

## Adding a Template

1.  **Fork the repository**
2.  **Create your directory**: `mkdir -p content/templates/<your-github-username>`
3.  **Create your index file**: `touch content/templates/<your-github-username>/index.json`
4.  **Add your template data**:

```json
{
  "templates": [
    {
      "slug": "my-awesome-template",
      "name": "My Awesome Template",
      "url": "https://github.com/your-username/my-awesome-template",
      "platform": "github",
      "type": "fullstack",
      "framework": "nextjs",
      "description": "A production-ready Next.js starter with authentication",
      "tags": ["nextjs", "typescript", "tailwind"],
      "features": ["App Router", "Auth.js", "Prisma"],
      "author": {
        "name": "Your Name",
        "github": "your-username",
        "url": "https://your-website.com"
      },
      "tier": "free",
      "license": "MIT"
    }
  ]
}
```

## Schema Reference

| Field         | Type     | Required | Description                                                    |
| :------------ | :------- | :------- | :------------------------------------------------------------- |
| `slug`        | string   | Yes      | Unique ID (kebab-case). CLI usage: `scaffoldor @user/slug`     |
| `name`        | string   | Yes      | Display name                                                   |
| `url`         | string   | Yes      | Git repository URL                                             |
| `platform`    | enum     | Yes      | `github`, `gitlab`, or `custom`                                |
| `type`        | enum     | Yes      | `frontend`, `backend`, `fullstack`, `mobile`, `cli`, `library` |
| `framework`   | enum     | No       | `react`, `vue`, `nextjs`, `express`, `hono`, etc.              |
| `description` | string   | No       | Short description shown in the registry                        |
| `tags`        | string[] | No       | Search keywords                                                |
| `features`    | string[] | No       | Key features list                                              |
| `author`      | object   | Yes      | Author details (`name`, `github`, `url`)                       |
| `tier`        | enum     | No       | `free` (default) or `premium`                                  |

## Validation

Before submitting, run:

```bash
bun run build:registry
```

This ensures your JSON is valid against our schema.
