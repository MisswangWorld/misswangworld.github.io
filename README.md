# Janis Wang — Personal Portfolio Website

A modern, responsive portfolio website. Static site — no build step, no framework, no npm.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `pages/index.html` | Hero, about, featured projects, contact |
| About Me | `pages/about-me.html` | Snake timeline of work & education with floating sidebar nav |
| All Projects | `pages/projects.html` | Grid view of all projects |
| Project Details | `pages/project-single.html` | Individual project page with version sidebar and Markdown content |

Root `index.html` is a redirect shim — immediately forwards to `pages/index.html`.

## Quick Start

This site uses `fetch()` to load content, so a local server is required:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server -p 8000
```

Open: **http://localhost:8000**

## Deployment

Static site — deploy to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages). No build step required.

## Project Structure

```
/
├── index.html                        # Root redirect → pages/index.html
├── pages/
│   ├── index.html                    # Homepage
│   ├── about-me.html                 # About Me — snake timeline
│   ├── projects.html                 # All projects grid
│   └── project-single.html          # Project detail template
├── components/
│   └── nav.js                        # Shared navigation component
├── assets/
│   └── avatar.jpg                    # Profile photo
├── content/
│   ├── social.json                   # Social links
│   ├── timeline.json                 # About Me timeline entries
│   └── projects/
│       ├── manifest.json             # Global project list
│       ├── README-projects.md        # Project system documentation
│       ├── example-project/          # Template / reference project
│       ├── seize/                    # Seize iOS app
│       └── pocket-cellar/            # Pocket Cellar iOS app
└── CLAUDE.md                         # AI assistant instructions & project reference
```

## Adding a Project

### 1. Create the project folder

```
content/projects/my-new-project/
```

### 2. Add `manifest.json`

```json
{
  "title": "My New Project",
  "description": "Brief description for project cards",
  "logo": "/logo.png",
  "sidebarLogo": "/sidebar-logo.png",
  "badge": "IOS APP",
  "color": "#fbac2f",
  "appStoreUrl": "https://apps.apple.com/...",
  "previewUrl": "",
  "versions": ["v1"],
  "latest": "v1"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Display name |
| `description` | Yes | Short text on project card |
| `logo` | No | Card image filename |
| `sidebarLogo` | No | Sidebar logo override (falls back to `logo`) |
| `badge` | No | Label on card — e.g. `"IOS APP"`, `"WEB APP"` |
| `color` | No | Card background hex |
| `appStoreUrl` | No | Non-empty → shows black App Store button |
| `previewUrl` | No | Non-empty → shows blue Live Preview button (`appStoreUrl` takes priority) |
| `versions` | Yes | Version IDs in chronological order |
| `latest` | No | Version to mark as "latest" |

### 3. Add version content

Create `content/projects/my-new-project/v1.md` with Markdown.

### 4. Register the project

Edit `content/projects/manifest.json`:

```json
{
  "featured": ["my-new-project"],
  "all": ["my-new-project"]
}
```

Add to `featured` to show on the homepage. Always add to `all`.

For detailed docs see [content/projects/README-projects.md](content/projects/README-projects.md).

## Updating the About Me Timeline

Edit `content/timeline.json`. Each entry:

```json
{
  "id": "job-1",
  "type": "work",
  "year": "2022 – Present",
  "title": "Senior Software Engineer",
  "organization": "Company Name",
  "location": "City, Country",
  "highlights": ["React", "Led team of 5"]
}
```

`type` is `"work"` or `"education"`. Entries are sorted newest-first at runtime.

## Customisation

### Colors

CSS custom properties defined inline in each page's `<style>` block:

```css
:root {
  --primary: #fbac2f;       /* Main accent (yellow/orange) */
  --accent: #2E9AD0;        /* Secondary accent (blue) */
  --black: #1a1a1a;         /* Text */
  --gray-light: #f5f5f2;    /* Background accent */
  --white: #FAF9F6;         /* Page background */
}
```

### Fonts

- **Syne** — headings and display text
- **Inter** — body text

### Content

- Profile photo: replace `assets/avatar.jpg`
- Name, title, bio: edit hero section in `pages/index.html`
- Contact links: edit contact section in `pages/index.html`

## License

Personal project. All rights reserved.
