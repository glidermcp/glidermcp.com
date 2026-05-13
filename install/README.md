# GliderMCP Install Assets

This directory contains copyable config templates for users who prefer direct MCP setup over plugin marketplace setup.

Prerequisites:

- .NET 10 SDK
- `dotnet tool install --global glider`
- `glider` available on `PATH`

Templates:

- `claude-code/.mcp.json` - project-scoped Claude Code MCP config.
- `codex/config.toml` - Codex global config snippet for Streamable HTTP.

Plugin marketplace setup is also available from this repository:

```bash
# Claude Code
claude plugin marketplace add glidermcp/glidermcp.com
claude plugin install glidermcp@glidermcp

# Codex
codex plugin marketplace add glidermcp/glidermcp.com
```

For Codex direct config, start Glider separately with:

```bash
glider --transport http --default-timeout 30m
```
