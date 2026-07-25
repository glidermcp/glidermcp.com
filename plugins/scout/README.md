# Scout Plugin

This plugin connects agent clients to a local Scout universal code search MCP server.

Prerequisites:

- A `scout` binary on `PATH`:

```sh
npm install -g @glidermcp/scout                     # any platform, needs Node.js/npm
curl -fsSL https://glidermcp.com/install.sh | sh    # Linux/macOS, installs to ~/.local/bin
brew install glidermcp/tap/scout                    # macOS/Linux
```

The bundled MCP config starts Scout over stdio with `"command": "scout"` and no args, so it indexes the directory the agent was started in. Pass `--root <dir>` if you need to point it somewhere else.

## Why a real binary and not `npx`

An `npx -y @glidermcp/scout` entry runs Scout fine on its own, but it leaves no `scout` binary on `PATH` - and `PATH` is how Glider and TGlider discover Scout to delegate `search_text` to it. With Scout reachable only through `npx` you get Scout's `find` tool and nothing else: Glider's `search_text` silently stays on loaded C# documents instead of covering every file under its solution root in any language, and TGlider's `search_text` fails outright with a `scout_not_installed` hint.

A global install also keeps one Scout version in play. An `npx` entry resolves the latest published version on each start, which can drift from whatever binary Glider federates to.

The install script does not edit `PATH`. If `~/.local/bin` is not already on it, add it, or point at the binary with `SCOUT_BINARY_PATH`. Turn the delegation off with `--no-scout` or `GLIDERMCP_NO_SCOUT=1`.
