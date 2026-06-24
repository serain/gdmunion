# GDM Union website

Live at: https://serain.github.io/gdmunion/

## Editing content

All page content lives in [`content/_index.md`](content/_index.md), in the front matter block between the `+++` markers at the top of the file. The body below the closing `+++` is not used.

Text fields support Markdown formatting: `**bold**`, `*italic*`, links, etc.

### Updating existing text

Find the field and change it:

```toml
tldr = """
Your updated text here. **This will be bold.**
"""
```

### Adding a historical precedent

Copy and paste a new block at the end of the precedents list:

```toml
[[extra.precedents]]
text = "Description of what the union achieved, with **bold** for emphasis."
```

### Adding a FAQ

Copy and paste a new block at the end of the FAQ list:

```toml
[[extra.faqs]]
question = "Your question here?"
answer = """
Your answer here. Can span multiple paragraphs.

Second paragraph.
"""
```

## Local preview

```bash
zola serve
```

Opens at http://127.0.0.1:1111 with live reload. Requires [Zola](https://www.getzola.org/documentation/getting-started/installation/) (`brew install zola` on Mac).

You don't need Zola just to edit content — GitHub Actions builds the site automatically when your PR is merged.

## Publishing a change

```bash
git checkout -b my-change
# edit content/_index.md
git add content/_index.md
git commit -m "describe your change"
git push origin my-change
# → open PR on GitHub, get it reviewed and merged
```

Merging to `main` triggers GitHub Actions which builds and deploys automatically.
