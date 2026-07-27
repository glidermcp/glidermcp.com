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

This plugin launches the literal command `scout`, so the client has to find a binary of that name on `PATH`; an `npx -y @glidermcp/scout` entry leaves none behind and the server simply fails to start.

TGlider needs one on `PATH` for a second reason: its `search_text` delegates to Scout and returns a `scout_not_installed` hint without it. Glider does not - its `search_text` searches the documents its own workspace has loaded and never calls Scout ([adr-007](https://github.com/rexsacrorum/glider/blob/main/docs/adr/adr-007-text-search-ownership.md)).

A global install also keeps one Scout version in play, starts faster than re-resolving the package on every launch, and keeps a single index cache. An `npx` entry resolves the latest published version on each start.

The install script does not edit `PATH`. If `~/.local/bin` is not already on your agent client's `PATH`, add it — or, if you would rather not touch `PATH`, set the plugin's MCP `command` to the binary's absolute path instead.

`SCOUT_BINARY_PATH` does not substitute for either: TGlider reads it to locate Scout for its own delegation, but it is not consulted when your client spawns this plugin's server. Use it when TGlider needs Scout and you are not configuring Scout as an MCP server at all.
