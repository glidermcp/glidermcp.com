# GliderMCP Install Assets

This directory contains copyable config templates for users who prefer direct MCP setup over plugin marketplace setup.

Prerequisites:

- .NET 10 SDK
- `dotnet tool install --global glider`
- `dotnet tool install --global glider-trace`
- Node.js/npm for `npx -y tglider`
- `npm install -g @glidermcp/scout` (or the install script / Homebrew tap)
- `glider`, `glider-trace`, `scout`, and `npx` available on `PATH`

Scout has to be a real binary on `PATH`, not an `npx` MCP entry. `PATH` is how Glider and TGlider discover Scout to delegate `search_text` to it - Glider upgrades from loaded C# documents to every file under its solution root in any language, and TGlider needs Scout for `search_text` at all. Reached only through `npx`, Scout still serves its own `find` tool, but both delegations quietly stop working.

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
