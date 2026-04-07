# Glider MCP

Glider is a Roslyn-powered Model Context Protocol (MCP) server for semantic C# code analysis and refactoring in MCP clients (for example, Claude Code).

For full documentation and setup guides, see [glidermcp.com](https://glidermcp.com).

## What you can do with Glider

- Resolve symbols the same way the compiler does (not grep).
- Resolve ambiguous names into stable keys (`symbolKey`) and use them across tool calls.
- Find references, overrides, implementations, unused symbols, and unused parameters.
- Query symbols by semantic predicates and search solution text (literal/regex).
- Navigate type hierarchies, call graphs, direct impact, and cascade impact.
- Inspect APIs with detailed type information and method signatures.
- Surface compiler diagnostics and grouped hotspots for a loaded solution/project.
- Investigate NuGet packages and external assembly usage before cleanup work.
- Review project graphs and identify likely-unused direct project references.
- Refactor safely: rename symbols and move types/members with reference updates.
- Apply deterministic formatting with preview diffs.
- Analyze architecture via dependency and complexity metrics.
- Batch multiple tool calls into a single request.

## Tool overview

- Diagnostics: `server_status`, `get_diagnostics`, `diagnostic_hotspots`
- Solution management: `load`, `reload`, `sync`, `get_file_contents`, `write_file`
- Symbol discovery: `resolve_symbol`, `search_symbols`, `get_symbol_at_position`, `get_symbol_info`
- References & relationships: `find_unused_symbols`, `find_unused_parameters`, `find_references`, `find_overrides`, `find_implementations`
- Code analysis: `get_type_info`, `get_method_signature`, `get_type_source`, `get_method_source`
- Semantic & text search: `semantic_query`, `search_text`
- Type hierarchy: `get_type_hierarchy`, `get_derived_types`, `find_member_in_hierarchy`
- Call graph & impact: `find_callers`, `get_outgoing_calls`, `analyze_change_impact`, `get_cascade_impact`
- Refactoring: `rename_symbol`, `move_type`, `move_member`
- Formatting: `organize_usings`, `format_document`
- External source & dependency usage: `view_external_definition`, `find_external_dependency_usages`, `find_package_usages`
- Architecture & metrics: `get_type_dependencies`, `get_project_graph`, `find_unused_project_references`, `analyze_complexity`
- Batching: `batch`

## Installation

### Prerequisites
- .NET 10 SDK

### Install / update / uninstall

Prerequisite: Glider currently requires .NET 10 SDK to be installed.

Run `dotnet --version` before installing. If `dotnet` is missing or the installed SDK is below 10, install the .NET 10 SDK first. On Windows you can use `winget install -e --id Microsoft.DotNet.SDK.10`; on macOS/Linux use the official Microsoft .NET 10 installation guide: https://dotnet.microsoft.com/download/dotnet/10.0

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

# Change the default async-tool timeout
glider --default-timeout 30m

# HTTP (default port: 5001)
glider --transport http
# Listens on http://localhost:5001/mcp

glider --transport http --port 8080
# Listens on http://localhost:8080/mcp

glider --transport http --port 8080 --default-timeout 30m
# Listens on http://localhost:8080/mcp with a longer server-side timeout
```

## Using with Claude Code (stdio)

```bash
# Project-scoped config (recommended)
claude mcp add --transport stdio glider --scope project -- glider

# For larger solutions
claude mcp add --transport stdio glider --scope project -- glider --default-timeout 30m
```

If you prefer not to rely on PATH:

```bash
claude mcp add --transport stdio glider --scope project -- ~/.dotnet/tools/glider
```

## Example prompts

```
Load the C# solution at /path/to/YourProject.sln
```

```
I changed some files on disk. Reload the current solution and then re-run diagnostics.
```

```
Load /path/to/MyApp.sln, run diagnostic_hotspots, and show the worst compiler hotspot.
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

```
Get the project graph and identify direct project references that can likely be removed.
```

## Troubleshooting

### `dotnet tool install --global glider` fails

Run `dotnet --version` first. If `dotnet` is missing or the installed SDK is below 10, install the .NET 10 SDK before retrying. On Windows you can use `winget install -e --id Microsoft.DotNet.SDK.10`; on macOS/Linux use the official Microsoft .NET 10 installation guide: https://dotnet.microsoft.com/download/dotnet/10.0

### `glider` “hangs” when I run it

That’s expected for stdio mode: it’s an MCP server waiting for a client connection, and it’s intentionally quiet by default. Configure it in your MCP client instead of running it in a terminal by itself (use `--verbose` if you want startup output/logs on stderr).

### `glider` not found after install

First confirm that `.NET 10 SDK` is installed, then make sure the .NET tools directory is on your `PATH`:

Make sure the .NET tools directory is on your `PATH`:
- macOS/Linux: `export PATH="$PATH:$HOME/.dotnet/tools"`
- Windows (PowerShell): `$env:PATH += ";$env:USERPROFILE\\.dotnet\\tools"`

### Solution/project won’t load

Use an absolute path to the `.sln` / `.slnx` / `.csproj` file.
