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
| Home | `index.html` | Landing page with hero, about, featured projects, and contact |
| All Projects | `projects.html` | Grid view of all projects |
| Project Details | `project.html` | Individual project page with version sidebar |

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
├── index.html              # Homepage
├── projects.html           # All projects page
├── project.html            # Project detail template
├── assets/
│   └── avatar.jpg          # Profile photo
├── projects/
│   ├── manifest.json       # Global project list
│   └── example-project/    # Individual project folder
│       ├── manifest.json   # Project info
│       ├── logo.png        # Project logo (optional)
│       ├── v1.md           # Version 1 content
│       ├── v2.md           # Version 2 content
│       └── v3.md           # Version 3 content
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

For detailed documentation, see [README-projects.md](README-projects.md).

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
