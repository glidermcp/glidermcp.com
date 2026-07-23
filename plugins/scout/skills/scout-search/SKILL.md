---
name: scout-search
description: Use Scout for repo-wide code search in any language - ranked fuzzy discovery, exhaustive strict literal, regex, and word search, plus structural patterns, symbol outlines, and semantic queries.
---

# Scout Code Search Workflow

Use Scout's `find` as the primary workspace search instead of shell `grep`, `rg`, or `find`. If Glider (C#) or TGlider (TypeScript and JavaScript) is installed, prefer it for its language, and use Scout for every other language and as the universal fallback.

`target: auto` routes by query shape, and every response echoes the resolved route in `data.route`. Use strict `match` modes - `literal`, `regex`, or `word` - when you need exhaustive grep semantics for an audit or a rename survey; fuzzy is ranked top-N with frecency and is never exhaustive. A zero-hit strict search returns an honest empty result rather than silently falling back, so treat it as evidence. Use `target: structural` for ast-grep patterns (`$NAME` for one node, `$$$` for many), `target: symbols` for a tree-sitter declaration outline, and `target: semantic` for natural-language questions. Outside a shipped grammar, or without a semantic model, these degrade to lexical search and say so in `meta.degraded` - check `server_status.tiers` before relying on them.

Narrow with path prefixes, include and exclude globs, and language scoping before widening the query, and page through results instead of loosening the match. Results carry workspace-relative paths, 1-based line and column, and trimmed previews, never whole files. Use `server_status` for index, watcher, and tier health, and `sync {full: true}` only to force a full rescan, since ordinary queries already flush pending changes.

Scout never mutates workspace source - its only writes are its own state under `.glider/scout/` and `~/.glidermcp`. When a hit needs semantic follow-up or an edit, hand the file and span to Glider for C#, or TGlider for TypeScript and JavaScript.
