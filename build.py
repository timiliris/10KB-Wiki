#!/usr/bin/env python3
"""10KB Wiki build script - bundles docs/ + src/ into a single wiki.html"""

import json
import os
import re
import sys

DOCS_DIR = "docs"
SRC_DIR = "src"
OUTPUT = "wiki.html"
WIKI_TITLE = "10KB Wiki"


def scan_docs(base):
    """Scan docs/ recursively and return (tree, pages) where:
    - tree: nested dict for sidebar navigation
    - pages: flat dict {path: markdown_content}
    """
    pages = {}
    tree = {"name": WIKI_TITLE, "children": []}

    for root, dirs, files in os.walk(base):
        dirs.sort()
        rel = os.path.relpath(root, base).replace("\\", "/")
        # Find the node in tree for this directory
        node = tree
        if rel != ".":
            for part in rel.split("/"):
                found = None
                for ch in node["children"]:
                    if ch.get("children") is not None and ch["name"] == part:
                        found = ch
                        break
                if not found:
                    found = {"name": part, "children": []}
                    node["children"].append(found)
                node = found

        for f in sorted(files):
            if not f.endswith(".md"):
                continue
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as fh:
                content = fh.read()

            # Page path: relative, no extension
            if rel == ".":
                page_path = f[:-3]  # strip .md
            else:
                page_path = rel + "/" + f[:-3]

            pages[page_path] = content

            # Display name from filename
            display = f[:-3].replace("-", " ").replace("_", " ").title()
            node["children"].append({"name": display, "path": page_path})

    return tree, pages


def minify_css(css):
    """CSS minification."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
    css = re.sub(r"\n\s*", "", css)
    css = re.sub(r"\s*([{}:;,>+~])\s*", r"\1", css)
    css = re.sub(r";\}", "}", css)
    css = re.sub(r"\s+", " ", css)
    return css.strip()


def minify_js(js):
    """JS minification - strip comments, collapse to minimal newlines."""
    js = re.sub(r"/\*.*?\*/", "", js, flags=re.DOTALL)
    lines = []
    for line in js.split("\n"):
        line = line.strip()
        if not line:
            continue
        lines.append(line)
    return "\n".join(lines)


def build():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    if not os.path.isdir(DOCS_DIR):
        print(f"Error: {DOCS_DIR}/ directory not found.")
        sys.exit(1)

    # Scan content
    tree, pages = scan_docs(DOCS_DIR)
    print(f"Found {len(pages)} page(s)")

    # Read source files
    with open(os.path.join(SRC_DIR, "template.html"), "r", encoding="utf-8") as f:
        template = f.read()
    with open(os.path.join(SRC_DIR, "style.css"), "r", encoding="utf-8") as f:
        css = f.read()
    with open(os.path.join(SRC_DIR, "wiki.js"), "r", encoding="utf-8") as f:
        js = f.read()

    # Minify
    css = minify_css(css)
    js = minify_js(js)

    # Build data JSON
    data = json.dumps({"tree": tree, "pages": pages}, ensure_ascii=False, separators=(",", ":"))

    # Assemble
    html = template
    html = html.replace("{{WIKI_TITLE}}", WIKI_TITLE)
    html = html.replace("{{CSS}}", css)
    html = html.replace("{{JS}}", js)
    html = html.replace("{{DATA}}", data)

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(html)

    total = len(html.encode("utf-8"))
    shell = total - len(data.encode("utf-8"))
    print(f"Built {OUTPUT}")
    print(f"  Total size: {total:,} bytes")
    print(f"  Shell size: {shell:,} bytes (target < 14kb)")
    print(f"  Content:    {len(data.encode('utf-8')):,} bytes ({len(pages)} pages)")

    if shell > 14000:
        print(f"  WARNING: Shell exceeds 14kb budget!")
    else:
        print(f"  OK: Shell is within budget.")


if __name__ == "__main__":
    build()
