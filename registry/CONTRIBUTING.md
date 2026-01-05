# Contributing Templates

Thank you for contributing to the Scaffoldor template registry!

## How to Add a Template

1. Fork this repository
2. Edit `registry.json` 
3. Add your template following the schema below
4. Submit a Pull Request

## Template Schema

```json
{
  "slug": "your-template-slug",
  "name": "Your Template Name",
  "url": "https://github.com/username/repo",
  "platform": "github",
  "type": "frontend",
  "framework": "react",
  "description": "A brief description of your template",
  "tags": ["tag1", "tag2"],
  "features": ["Feature 1", "Feature 2"],
  "author": {
    "name": "Your Name",
    "github": "yourusername"
  },
  "stats": {
    "stars": 0,
    "downloads": 0
  },
  "tier": "free",
  "license": "MIT"
}
```

### Required Fields

| Field | Description |
|-------|-------------|
| `slug` | Unique ID (lowercase, hyphens only) |
| `name` | Human-readable name |
| `url` | Git repository URL |
| `type` | `frontend`, `backend`, `fullstack`, `mobile`, `cli`, `library`, `other` |
| `author.name` | Your name or org name |

### Optional Fields

| Field | Description |
|-------|-------------|
| `platform` | `github`, `gitlab`, `custom` (default: `github`) |
| `framework` | `react`, `vue`, `nextjs`, `hono`, `elysia`, etc. |
| `description` | Short description |
| `tags` | Searchable tags |
| `features` | Feature list |
| `license` | License identifier (default: `MIT`) |

## Guidelines

- **Quality**: Templates should be well-documented and functional
- **No duplicates**: Check if a similar template already exists
- **Active maintenance**: Templates should be actively maintained
- **License**: Must have an open-source license
