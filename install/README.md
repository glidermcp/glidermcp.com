# GliderMCP Install Assets

This directory contains copyable config templates for users who prefer direct MCP setup over plugin marketplace setup.

Prerequisites:

- .NET 10 SDK
- `dotnet tool install --global glider`
- `dotnet tool install --global glider-trace`
- Node.js/npm for `npx -y tglider`
- `glider`, `glider-trace`, and `npx` available on `PATH`

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

# Codex
codex plugin marketplace add glidermcp/glidermcp.com
```
