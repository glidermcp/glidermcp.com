# GliderMCP Install Assets

This directory contains copyable config templates for users who prefer direct MCP setup over plugin marketplace setup.

Prerequisites:

- .NET 10 SDK
- `dotnet tool install --global glider`
- `dotnet tool install --global glider-trace`
- Node.js/npm for `npx -y tglider`
- `npm install -g @glidermcp/scout` (or the install script / Homebrew tap)
- `glider`, `glider-trace`, `scout`, and `npx` available on `PATH`

Scout is launched as the literal command `scout`, so it needs a real binary on `PATH`; an `npx` MCP entry leaves none behind. TGlider needs one there for a second reason - its `search_text` delegates to Scout and returns a `scout_not_installed` hint without it. Glider does not: its `search_text` searches the documents its own workspace has loaded and never calls Scout.

```bash
npm install -g @glidermcp/scout
```

Templates:

- `claude-code/.mcp.json` - project-scoped Claude Code MCP config.
- `codex/config.toml` - Codex global config snippet.

Plugin marketplace setup is also available from this repository:

```bash
# Claude Code
claude plugin marketplace add glidermcp/glidermcp.com
claude plugin install glidermcp@glidermcp
claude plugin install glider-trace@glidermcp
claude plugin install tglider@glidermcp
claude plugin install scout@glidermcp

# Codex
codex plugin marketplace add glidermcp/glidermcp.com
```
