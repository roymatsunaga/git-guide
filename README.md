# Comprehensive Git Guide

A practical guide to Git for teams new to version control, built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/).

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Building for Production

```bash
npm run build
npm run preview
```

## 📝 Structure

- **`src/content/docs/`** — Documentation markdown files
- **`public/diagrams/`** — SVG diagrams referenced in docs
- **`astro.config.mjs`** — Astro configuration
- **`tsconfig.json`** — TypeScript configuration

## 📖 Content

The guide is organized as a learning path:

1. **Concepts** — Understanding version control and Git fundamentals
2. **Installation** — Getting Git running on macOS and Linux
3. **Basic Workflow** — Daily Git operations (commit, push, pull)
4. **Branching & Merging** — Working with branches and merging code
5. **Advanced Features** — Rebase, cherry-pick, stash, and more
6. **Collaboration** — Pull request workflows and team practices
7. **Troubleshooting** — Fixing mistakes and recovering work
8. **Command Reference** — Quick lookup for Git commands
9. **Visual Guide** — Color-coded commit graph diagrams

## 🎨 Features

- **SVG Diagrams** — Visual representations of Git concepts with centered, color-coded branch labels
- **Responsive Design** — Mobile-friendly documentation
- **Dark Mode** — Built-in theme switching
- **Search** — Full-text search across documentation
- **Fast** — Static site generation with Astro

## 🚢 Deployment

This site is automatically deployed to GitHub Pages when you push to the `main` branch. The GitHub Actions workflow handles building and deploying.

## 📄 License

This documentation is provided as-is for learning and reference purposes.
