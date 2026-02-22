# 10KB Wiki

**A complete wiki in a single HTML file under 10KB.**

No server. No framework. No dependencies. Just double-click `wiki.html`.

```
docs/*.md  →  python build.py  →  wiki.html (< 10KB)
```

## Features

- **Single file** — your entire wiki is one self-contained HTML file
- **Works offline** — opens with `file://`, no server needed
- **Zero dependencies** — only Python 3 for the build step
- **Dark/Light mode** — automatically follows your system theme
- **Wiki links** — `[[Page Name]]` for internal navigation
- **Searchable sidebar** — filter pages instantly
- **Responsive** — collapsible sidebar on mobile
- **Full Markdown** — headings, bold, italic, strikethrough, code blocks, tables, images, blockquotes, lists, horizontal rules

## Quick Start

**1. Write Markdown files in `docs/`**

```
docs/
├── index.md              ← home page
└── guide/
    └── getting-started.md
```

**2. Build**

```bash
python build.py
```

**3. Open**

Double-click `wiki.html`. Done.

## How It Works

The build script scans `docs/` for `.md` files, then bundles everything — HTML shell, CSS, JS engine, and all your Markdown content — into a single `wiki.html`.

The JS engine (~4KB) includes a custom Markdown parser and handles routing, sidebar navigation, and search. Pages are rendered on demand via hash routing (`wiki.html#guide/getting-started`).

## Size Budget

| Component | Size |
|-----------|------|
| HTML shell | ~500B |
| CSS | ~3.2KB |
| JS engine | ~3.9KB |
| **Total shell** | **~7.7KB** |
| Content | varies |

The shell stays under 8KB. Your content is added on top. With example docs, the total is ~9.5KB.

## Markdown Support

| Feature | Syntax |
|---------|--------|
| Headings | `# H1` to `###### H6` |
| Bold | `**text**` |
| Italic | `*text*` |
| Strikethrough | `~~text~~` |
| Inline code | `` `code` `` |
| Code blocks | ` ``` ` with language |
| Images | `![alt](url)` |
| Links | `[text](url)` |
| Wiki links | `[[Page Name]]` |
| Lists | `- item` or `1. item` (nested) |
| Blockquotes | `> quote` |
| Tables | Pipe tables |
| Horizontal rule | `---` |

## Docker

Serve your wiki with an ultra-lightweight container:

```bash
docker build -t 10kb-wiki .
docker run -p 8080:80 10kb-wiki
```

Then open `http://localhost:8080`.

## Customization

Edit CSS variables in `src/style.css` to change the theme:

```css
:root {
  --bg: #fff;      /* background */
  --fg: #1a1a2e;   /* text color */
  --ac: #2563eb;   /* accent/links */
}
```

## Project Structure

```
├── docs/              # Your Markdown content
│   ├── index.md
│   └── guide/
│       └── getting-started.md
├── src/
│   ├── template.html  # HTML shell
│   ├── style.css      # Styles (dark/light)
│   └── wiki.js        # MD parser + engine
├── build.py           # Build script (Python 3)
├── Dockerfile         # Ultra-light container
└── wiki.html          # OUTPUT — your wiki
```

## License

MIT
