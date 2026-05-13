---
description: Use GliderMCP for C#/.NET navigation, diagnostics, references, call graphs, impact analysis, and safe refactoring.
---

# GliderMCP C# Workflow

Use GliderMCP when working in a C# or .NET repository and the task needs semantic facts rather than plain text search.

Start by checking `server_status`. If no workspace is loaded, call `load` with the relevant `.sln`, `.slnx`, or `.csproj`. Prefer `find_code` as the front door when the user asks to locate behavior by intent. Use `search_symbols`, `resolve_symbol`, or `get_symbol_at_position` before symbol-specific tools, and treat returned `symbolKey` values as opaque stable identities.

For edits, gather evidence first with tools such as `find_references`, `find_implementations`, `find_callers`, `get_outgoing_calls`, `analyze_change_impact`, `get_cascade_impact`, `get_diagnostics`, and `diagnostic_hotspots`. Prefer preview-first refactoring tools where available. After external edits, use `sync` for changed `.cs` files and `reload` for structural project changes.

Use shell text search only for non-C# assets, literal strings, config files, or when a semantic tool cannot answer the question.
