# Glider MCP

Glider is a Roslyn-powered Model Context Protocol (MCP) server for semantic C# code analysis and refactoring in MCP clients (for example, Claude Code).

For full documentation and setup guides, see [glidermcp.com](https://glidermcp.com).

## What you can do with Glider

- Resolve symbols the same way the compiler does (not grep).
- Resolve ambiguous names into stable keys (`symbolKey`) and use them across tool calls.
- Find references, overrides, and implementations by exact `symbolKey`.
- Query symbols by semantic predicates and search solution text (literal/regex).
- Navigate type hierarchies, call graphs, and change impact.
- Inspect APIs with detailed type information and method signatures.
- Surface compiler diagnostics for a loaded solution/project.
- Refactor safely: rename symbols and move types/members with reference updates.
- Apply deterministic formatting with preview diffs.
- Analyze architecture via dependency and complexity metrics.
- Batch multiple tool calls into a single request.

## Tool overview

- Diagnostics: `server_status`, `get_diagnostics`
- Solution management: `load`, `reload`, `sync`
- Symbol discovery: `resolve_symbol`, `search_symbols`, `get_symbol_at_position`, `get_symbol_info`
- References & relationships: `find_references`, `find_overrides`, `find_implementations`
- Code analysis: `get_type_info`, `get_method_signature`, `get_type_source`, `get_method_source`
- Semantic & text search: `semantic_query`, `search_text`
- Type hierarchy: `get_type_hierarchy`, `get_derived_types`, `find_member_in_hierarchy`
- Call graph & impact: `find_callers`, `get_outgoing_calls`, `analyze_change_impact`
- Refactoring: `rename_symbol`, `move_type`, `move_member`
- Formatting: `organize_usings`, `format_document`
- External source: `view_external_definition`
- Architecture & metrics: `get_type_dependencies`, `analyze_complexity`
- Batching: `batch`

## Installation

### Prerequisites
- .NET 10.0 SDK or later

### Install / update / uninstall

```bash
dotnet tool install --global glider
dotnet tool update --global glider
dotnet tool uninstall --global glider
```

## Running Glider

Glider supports two transports:

- Stdio (default): for local MCP clients like Claude Code
- HTTP: for MCP clients that connect over Streamable HTTP

```bash
# Stdio (default)
glider

# Show CLI help and exit
glider --help
glider -h

# Print version and exit
glider --version
glider -v

# Enable logs and (for stdio) a startup banner on stderr
glider --verbose

# HTTP (default port: 5001)
glider --transport http
# Listens on http://localhost:5001/mcp

glider --transport http --port 8080
# Listens on http://localhost:8080/mcp
```

## Using with Claude Code (stdio)

```bash
# Project-scoped config (recommended)
claude mcp add --transport stdio glider --scope project -- ~/.dotnet/tools/glider
```

If you prefer not to call the shim directly:

```bash
claude mcp add --transport stdio glider --scope project -- dotnet tool run --global glider
```

## Example prompts

```
Load the C# solution at /path/to/YourProject.sln
```

```
I changed some files on disk. Reload the current solution and then re-run diagnostics.
```

```
Find all usages of MyNamespace.MyType.MyMethod
```

```
Resolve MyNamespace.MyType.MyMethod, then find_references for the selected symbolKey
```

```
Rename the symbol OldName to NewName (preview the diff first).
```

## Troubleshooting

### `glider` “hangs” when I run it

That’s expected for stdio mode: it’s an MCP server waiting for a client connection, and it’s intentionally quiet by default. Configure it in your MCP client instead of running it in a terminal by itself (use `--verbose` if you want startup output/logs on stderr).

### `glider` not found after install

Make sure the .NET tools directory is on your `PATH`:

- macOS/Linux: `export PATH="$PATH:$HOME/.dotnet/tools"`
- Windows (PowerShell): `$env:PATH += ";$env:USERPROFILE\\.dotnet\\tools"`

### Solution/project won’t load

Use an absolute path to the `.sln` / `.slnx` / `.csproj` file.
