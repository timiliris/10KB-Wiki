# Getting Started

## Setup

Create Markdown files in `docs/`:

```
docs/
├── index.md
└── guide/
    └── getting-started.md
```

## Build

```bash
python build.py
```

This bundles everything into a single `wiki.html`.

## Writing

Each `.md` file becomes a page. The path determines the URL:

- `docs/index.md` → `#index`
- `docs/guide/getting-started.md` → `#guide/getting-started`

### Wiki Links

Link between pages with double brackets:

```markdown
See [[Getting Started]] for more.
```

### Code Blocks

```python
def hello():
    print("Hello, lightWiki!")
```

> **Tip:** Use the sidebar search to filter pages by name.

Back to [[index]].
