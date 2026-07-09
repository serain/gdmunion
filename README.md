# GDM Union website

Live at: https://www.gdmunion.co.uk

A one-page [Zola](https://www.getzola.org/) site. Most edits are text-only and need no tooling.

## Where the content lives

| What | File |
|------|------|
| Page copy (hero, TL;DR, section text, footer) | [`content/_index.md`](content/_index.md) — front matter between the `+++` markers |
| The "wins" cards | [`data/precedents.toml`](data/precedents.toml) |
| FAQ entries | [`data/faqs.toml`](data/faqs.toml) |
| Archive table rows | [`data/archive.toml`](data/archive.toml) — the press coverage on the Archive page |
| Images | [`static/`](static/) (card photos live in `static/precedents/`) |

Text fields support Markdown: `**bold**`, `*italic*`, `[links](https://example.com)`, etc.

## Common edits

### Change page copy

Open [`content/_index.md`](content/_index.md) and edit the field:

```toml
tldr = """
Your updated text here. **This will be bold.**
"""
```

### Add a "win" card

Add a block to [`data/precedents.toml`](data/precedents.toml):

```toml
[[precedent]]
headline = "Short, punchy win"
text = "One sentence of context."
image = "precedents/your-image.jpg"   # put the file in static/precedents/
```

### Add a FAQ

Add a block to [`data/faqs.toml`](data/faqs.toml):

```toml
[[faq]]
question = "Your question here?"
answer = """
Your answer. Can span multiple paragraphs and use Markdown.
"""
```

### Add an Archive article

The Archive page is a table of press coverage. Add a row to
[`data/archive.toml`](data/archive.toml) — keep the list newest-first:

```toml
[[article]]
date = "April 16, 2026"
title = "Headline as it should appear (links to the article)"
url = "https://example.com/the-article"   # leave "" for an entry with no link
source = "example.com"
# summary = "Optional. Replaces the placeholder in the AI Summary column."
```

## Local preview

```bash
zola serve
```

Opens at http://127.0.0.1:1111 with live reload. Requires [Zola](https://www.getzola.org/documentation/getting-started/installation/) (`brew install zola` on Mac).

If you edit a file under `data/` and don't see it hot-reload, restart `zola serve` — the deploy always picks it up. You don't need Zola at all just to edit content; GitHub Actions builds the site when your PR is merged.

## Publishing a change

```bash
git checkout -b my-change
# edit the relevant file(s)
git add -A
git commit -m "describe your change"
git push origin my-change
# → open a PR on GitHub, get it reviewed and merged
```

Merging to `main` triggers GitHub Actions, which builds and deploys automatically.
