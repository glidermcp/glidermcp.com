# glidermcp.com (Public Support Shell)

This repository is the public support and issue-intake front door for the Glider MCP product family.

## Current repository role

- Public issue reporting and support triage
- Public project links and migration guidance
- Sponsorship metadata

This repository is intentionally minimal.

## Where to file issues

Please open issues in this repository and select the relevant product in the issue template:

- `glider` (C# MCP)
- `glider-trace` (runtime evidence MCP server)
- `tglider` (TypeScript MCP)
- `scout` (universal code search MCP)
- `glidermcp-web` (website/docs UX)

## Quick links

- Product site: https://glidermcp.com
- Glider: https://glidermcp.com/glider - https://www.nuget.org/packages/glider
- GliderTrace: https://glidermcp.com/glider-trace - https://www.nuget.org/packages/glider-trace
- TGlider: https://glidermcp.com/tglider - https://www.npmjs.com/package/tglider
- Scout: https://glidermcp.com/scout - https://www.npmjs.com/package/@glidermcp/scout

## Plugin and config assets

This repository ships root-level marketplace and config assets for agent clients:

- `plugins/glidermcp/` - C# semantic navigation plugin.
- `plugins/glider-trace/` - .NET runtime evidence plugin.
- `plugins/tglider/` - TypeScript and JavaScript semantic navigation plugin.
- `plugins/scout/` - universal code search plugin.
- `.claude-plugin/marketplace.json` - Claude Code marketplace entry.
- `.agents/plugins/marketplace.json` - Codex marketplace entry.
- `install/claude-code/.mcp.json` - direct Claude Code project config template.
- `install/codex/config.toml` - direct Codex global config snippet.

Claude Code plugin install:

```bash
claude plugin marketplace add glidermcp/glidermcp.com
claude plugin install glidermcp@glidermcp
claude plugin install glider-trace@glidermcp
claude plugin install tglider@glidermcp
claude plugin install scout@glidermcp
```

Codex plugin install:

```bash
codex plugin marketplace add glidermcp/glidermcp.com
codex
# Open /plugins and install glidermcp, glider-trace, tglider, or scout.
```

## Notes

- Pull requests with runtime/product code are not accepted in this repository.
- If maintainers need implementation details, they will mirror or transfer context into the private monorepo.
