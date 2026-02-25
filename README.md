# Janis Wang - Personal Portfolio Website

A modern, responsive portfolio website to showcase projects and connect with visitors.

## Features

- Clean, minimal design with yellow/orange accent colors
- Responsive layout for desktop, tablet, and mobile
- Dynamic project showcase with version history
- Markdown-based content management for projects

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `pages/index.html` | Landing page with hero, about, featured projects, and contact |
| About Me | `pages/about-me.html` | Snake timeline of work & education with floating sidebar nav |
| All Projects | `pages/projects.html` | Grid view of all projects |
| Project Details | `pages/project-single.html` | Individual project page with version sidebar |

Root `index.html` is a redirect shim — it immediately forwards visitors to `pages/index.html`.

## Quick Start

### Running Locally

This site uses JavaScript `fetch()` to load project content, so you need a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if http-server is installed)
npx http-server -p 8000
```

Then open: **http://localhost:8000**

### Deployment

This is a static site that can be deployed to any static hosting:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

No build step required - just upload all files.

## Project Structure

```
/
├── index.html              # Root redirect → pages/index.html
├── pages/
│   ├── index.html          # Homepage
│   ├── about-me.html       # About Me — snake timeline
│   ├── projects.html       # All projects page
│   └── project-single.html # Project detail template
├── components/
│   └── nav.js              # Shared navigation component
├── assets/
│   └── avatar.jpg          # Profile photo
├── content/                # All data & content files
│   ├── timeline.json       # About Me timeline entries
│   └── projects/           # Project content & config
│       ├── manifest.json   # Global project list
│       ├── README-projects.md  # Detailed project system docs
│       └── example-project/   # Individual project folder
│           ├── manifest.json  # Project info
│           ├── logo.png       # Project logo (optional)
│           ├── v1.md          # Version 1 content
│           ├── v2.md          # Version 2 content
│           └── v3.md          # Version 3 content
├── README.md               # This file
└── README-projects.md      # Detailed project system docs
```

## Adding Projects

### 1. Create Project Folder

```bash
mkdir projects/my-new-project
```

### 2. Add Project Manifest

Create `projects/my-new-project/manifest.json`:

```json
{
  "title": "My New Project",
  "description": "Brief description for project cards",
  "logo": "logo.png",
  "badge": "NEW",
  "color": "#fbac2f",
  "versions": ["v1"],
  "latest": "v1"
}
```

### 3. Add Version Content

Create `projects/my-new-project/v1.md` with your project documentation in Markdown.

### 4. Register the Project

Edit `projects/manifest.json`:

```json
{
  "featured": ["my-new-project"],
  "all": ["my-new-project"]
}
```

For detailed documentation, see [README-projects.md](content/projects/README-projects.md).

## Updating the About Me Timeline

Edit `content/timeline.json`. Each entry follows this schema:

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

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (used for sidebar anchor links) |
| `type` | `"work"` / `"education"` | Controls colour coding on the timeline |
| `year` | string | Year or range displayed on the card |
| `title` | string | Job title or degree name |
| `organization` | string | Company or university name |
| `location` | string | Work / study location |
| `highlights` | string[] | Tags shown as inline pills on the card |

Entries are sorted newest-first automatically at runtime.

## Customization

### Colors

Edit CSS variables in each HTML file:

```css
:root {
  --primary: #fbac2f;        /* Main accent color */
  --primary-dark: #e99a1e;   /* Darker variant */
  --primary-light: #ffc04d;  /* Lighter variant */
  --accent: #2E9AD0;         /* Secondary accent (blue) */
  --black: #1a1a1a;          /* Text color */
  --gray-dark: #666;
  --gray: #999;
  --gray-light: #f5f5f2;     /* Background accent */
  --white: #FAF9F6;          /* Main background */
}
```

### Fonts

The site uses Google Fonts:
- **Syne** - Headings and display text
- **Inter** - Body text

### Content

- **Profile photo**: Replace `assets/avatar.jpg`
- **Name & title**: Edit hero section in `index.html`
- **About stats**: Edit about section in `index.html`
- **Contact links**: Edit contact section in `index.html`
- **Footer**: Edit footer in all HTML files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Personal project. All rights reserved.
