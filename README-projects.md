# Project Template System

This document explains how to add and manage projects on your portfolio website.

## Quick Start

1. Create a new folder in `/projects/` with your project name
2. Add a `manifest.json` file for version info
3. Add markdown files for each version (`v1.md`, `v2.md`, etc.)
4. **Add your project to `/projects/manifest.json`** (global projects list)
5. Link to your project using `project.html?name=your-project-name`

---

## Folder Structure

```
/projects/
  manifest.json           # Global: Lists all project IDs
  your-project-name/
    manifest.json         # Project info (title, description, logo, versions)
    logo.png              # Optional: Project logo image
    v1.md                 # Required: First version content
    v2.md                 # Optional: Second version
    v3.md                 # Optional: Third version
    ...
  another-project/
    manifest.json
    logo.png
    v1.md
    v2.md
```

---

## Global Projects Manifest

The file `/projects/manifest.json` lists all projects that appear on the **All Projects** page (`projects.html`).

### Format

```json
{
  "featured": ["my-project"],
  "all": ["my-project", "another-project"]
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `featured` | array | Yes | Project IDs to show on homepage (Featured Projects section) |
| `all` | array | Yes | All project IDs to show on the All Projects page |

### Adding a New Project to the List

Edit `/projects/manifest.json` and add your project ID to the arrays:

```json
{
  "featured": ["my-project", "your-new-project"],
  "all": ["my-project", "your-new-project", "another-project"]
}
```

**Note:** Only add to `featured` if you want it on the homepage. Always add to `all`.

---

## Naming Conventions

### Project Folder Names

- Use **lowercase** letters only
- Use **hyphens** (`-`) to separate words (no spaces or underscores)
- Keep names short but descriptive

**Examples:**
- `my-awesome-app`
- `portfolio-website`
- `weather-tracker`
- `task-manager-pro`

**Avoid:**
- `My Awesome App` (no spaces)
- `my_awesome_app` (no underscores)
- `MyAwesomeApp` (no camelCase)

### Version Files

- Use format: `v{number}.md`
- Start with `v1.md`
- Increment sequentially: `v1.md`, `v2.md`, `v3.md`, etc.
- Always use lowercase `v`

**Valid:**
- `v1.md`
- `v2.md`
- `v10.md`

**Invalid:**
- `V1.md` (uppercase V)
- `version1.md` (wrong format)
- `1.0.md` (wrong format)

---

## Project manifest.json Format

Each project folder must have a `manifest.json` file with project info.

```json
{
  "title": "Your Project Title",
  "description": "A brief description of the project",
  "logo": "logo.png",
  "badge": "NEW",
  "color": "#fbac2f",
  "versions": ["v1", "v2", "v3"],
  "latest": "v3"
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Display name for the project |
| `description` | string | Yes | Brief description (1-2 sentences) for project cards |
| `logo` | string | No | Logo filename (e.g., "logo.png") - place in project folder |
| `badge` | string | No | Badge text (e.g., "NEW", "FEATURED", "DEMO") |
| `color` | string | No | Background color for card (hex format, defaults to primary) |
| `title` | string | Yes | Display name of your project (can include spaces and special characters) |
| `versions` | array | Yes | List of available versions in chronological order (oldest first) |
| `latest` | string | No | The version to highlight as "latest" (defaults to last in array) |

### Examples

**Simple project with one version:**
```json
{
  "title": "My First App",
  "versions": ["v1"]
}
```

**Project with multiple versions:**
```json
{
  "title": "Task Manager Pro",
  "versions": ["v1", "v2", "v3", "v4"],
  "latest": "v4"
}
```

---

## Markdown File Structure

Each version file (e.g., `v1.md`) should contain all information about that version. Here's a recommended structure:

```markdown
# Project Name - v1

Brief description of this version.

## Overview

Detailed explanation of what this project/version does.

## Features

- **Feature One**: Description
- **Feature Two**: Description
- **Feature Three**: Description

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React      | Frontend |
| Node.js    | Backend |

## Getting Started

Instructions for running the project.

## Screenshots

![Screenshot](path/to/screenshot.png)

## Links

- [Live Demo](https://example.com)
- [Source Code](https://github.com/...)

---

## Changelog

### v1.0.0 - Release Date

- List of changes
- Bug fixes
- New features
```

### Supported Markdown Features

The template supports full GitHub-flavored markdown:

- **Headers** (`#`, `##`, `###`)
- **Bold** (`**text**`) and *italic* (`*text*`)
- **Lists** (ordered and unordered)
- **Links** (`[text](url)`)
- **Images** (`![alt](url)`)
- **Code blocks** (inline and fenced)
- **Tables**
- **Blockquotes**
- **Horizontal rules** (`---`)

---

## Linking to Projects

### From Your Main Page

Use the project template with the `name` parameter:

```html
<a href="project.html?name=my-project">View Project</a>
```

### Direct Link to Specific Version

Add a hash with the version name:

```html
<a href="project.html?name=my-project#v2">View v2</a>
```

### URL Format

```
project.html?name={project-folder-name}
project.html?name={project-folder-name}#{version}
```

**Examples:**
- `project.html?name=example-project` → Opens latest version
- `project.html?name=example-project#v1` → Opens v1 specifically
- `project.html?name=task-manager#v3` → Opens v3 of task-manager

---

## Adding a New Project

### Step-by-Step

1. **Create the folder:**
   ```
   /projects/my-new-project/
   ```

2. **Create manifest.json:**
   ```json
   {
     "title": "My New Project",
     "versions": ["v1"],
     "latest": "v1"
   }
   ```

3. **Create v1.md:**
   ```markdown
   # My New Project - v1

   Description of your project...

   ## Features
   - Feature 1
   - Feature 2
   ```

4. **Update index.html** to link to your project:
   ```html
   <a href="project.html?name=my-new-project">
     View Project
   </a>
   ```

---

## Adding a New Version

1. **Create the new version file** (e.g., `v2.md`) in your project folder

2. **Update manifest.json:**
   ```json
   {
     "title": "My Project",
     "versions": ["v1", "v2"],
     "latest": "v2"
   }
   ```

3. That's it! The sidebar will automatically show the new version.

---

## Example Project

An example project is included at `/projects/example-project/` for reference. You can:

- View it at `project.html?name=example-project`
- Use it as a template for your own projects
- Delete it when you no longer need it

---

## Troubleshooting

### "Project Not Found" Error

- Check that the folder name matches the URL parameter exactly
- Ensure `manifest.json` exists and is valid JSON
- Folder names are case-sensitive

### "Content Not Found" Error

- Verify the version file exists (e.g., `v1.md`)
- Check that the version is listed in `manifest.json`
- File names are case-sensitive (`v1.md`, not `V1.md`)

### Markdown Not Rendering

- Check browser console for JavaScript errors
- Ensure the markdown file is valid UTF-8 text
- Try refreshing the page

---

## File Checklist

For each project, ensure you have:

- [ ] Folder with lowercase, hyphenated name
- [ ] `manifest.json` with valid JSON
- [ ] At least one version file (`v1.md`)
- [ ] All versions in manifest are actual files
- [ ] Link added to main page (index.html)
