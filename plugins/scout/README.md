# Scout Plugin

This plugin connects agent clients to a local Scout universal code search MCP server.

Prerequisites:

- Node.js/npm
- `npx` available on `PATH`

The bundled MCP config starts Scout over stdio with `npx -y @glidermcp/scout`.

## Also install Scout globally

The bundled `npx` entry gives the agent Scout's `find` tool, but it leaves no `scout` binary on `PATH`. A real binary on `PATH` is what lets Glider and TGlider delegate `search_text` to Scout - Glider upgrades from loaded C# documents to every file under its solution root in any language, and TGlider needs Scout for `search_text` at all (without it the tool returns a `scout_not_installed` hint).

```sh
npm install -g @glidermcp/scout
curl -fsSL https://glidermcp.com/install.sh | sh   # Linux/macOS, installs to ~/.local/bin
brew install glidermcp/tap/scout                   # macOS/Linux
```

The install script does not edit `PATH`. If `~/.local/bin` is not already on it, add it, or point at the binary with `SCOUT_BINARY_PATH`. With Scout installed globally you can also swap the bundled config to `"command": "scout"` with no args. Turn the delegation off with `--no-scout` or `GLIDERMCP_NO_SCOUT=1`.
