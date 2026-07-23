# GliderMCP Install Assets

This directory contains copyable config templates for users who prefer direct MCP setup over plugin marketplace setup.

Prerequisites:

- .NET 10 SDK
- `dotnet tool install --global glider`
- `dotnet tool install --global glider-trace`
- Node.js/npm for `npx -y tglider` and `npx -y @glidermcp/scout`
- `glider`, `glider-trace`, and `npx` available on `PATH`

Scout also belongs on `PATH` as a real binary, not only as an `npx` MCP entry. Glider and TGlider delegate `search_text` to a global `scout` - Glider upgrades from loaded C# documents to every file under its solution root in any language, and TGlider needs Scout for `search_text` at all:

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
