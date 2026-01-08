# Glider

A Roslyn-powered MCP (Model Context Protocol) server that provides C# code analysis capabilities to LLMs like Claude.

Glider is distributed as a .NET global tool and exposes powerful code analysis tools through the MCP protocol, enabling AI assistants to understand and navigate your C# codebase with deep semantic knowledge.

## Features

Glider provides 14 core tools for comprehensive C# code analysis and refactoring:

### Diagnostics
- **get_diagnostics** - Compiler diagnostics (errors, warnings, info) for the loaded solution

### Solution Management
- **load_solution** - Load C# solution for analysis
- **load_project** - Load standalone C# project when no solution exists

### Code Analysis
- **find_usages** - Find all references to a symbol
- **get_type_info** - Get type details (members, inheritance, interfaces)
- **get_method_signature** - Get method signature and parameters
- **find_implementation** - Find concrete implementations of interfaces/abstract classes
- **find_types** - Find types by name pattern (supports wildcards)

### Refactoring
- **rename_symbol** - Semantically rename symbols across the solution (unlike grep, understands code semantics)
- **move_type** - Move types to different files and/or namespaces
- **move_member** - Move members between types

### External Source
- **view_external_definition** - View source code of NuGet/framework types (via SourceLink or decompilation)

### Architecture & Metrics
- **get_type_dependencies** - Analyze type dependencies (uses/used-by)
- **analyze_complexity** - Complexity metrics (cyclomatic complexity, LOC, method counts)

## Transports

Glider supports two transport mechanisms:

- **Stdio** (default): For local use with MCP clients like Claude Code
- **HTTP**: For remote access via HTTP (Streamable HTTP transport for Codex compatibility)

```bash
# Stdio (default)
glider

# HTTP (for remote access, e.g., Codex)
glider --transport http
# Listens on http://localhost:5001/mcp

glider --transport http --port 8080
# Listens on http://localhost:8080/mcp
```

## Installation

### Prerequisites
- .NET 10.0 SDK or later

### From NuGet (Recommended)

```bash
dotnet tool install --global glider
```

### Update to Latest

```bash
dotnet tool update --global glider
```

### Install from Source (Development)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/glider.git
cd glider
```

2. Build and pack the tool:
```bash
dotnet pack src/Glider.Server/Glider.Server.csproj
```

3. Install the tool globally:
```bash
dotnet tool install --global --add-source ./src/Glider.Server/nupkg glider --version 0.3.0
```

4. Ensure the .NET tools directory is on your PATH (macOS/Linux):
```bash
export PATH="$PATH:$HOME/.dotnet/tools"
```

5. Verify installation:
```bash
dotnet tool list -g
```

If `glider` is still not found, confirm the tool is installed and run it directly:
```bash
dotnet tool list -g
~/.dotnet/tools/glider
```

Note: `glider` is a stdio MCP server, so it waits for input and won't print a version banner.

### Uninstall
```bash
dotnet tool uninstall --global glider
```

## Usage with Claude Code

### Configuration

Add Glider via the Claude Code CLI:

```bash
# Project-scoped config (recommended)
claude mcp add --transport stdio glider --scope project -- ~/.dotnet/tools/glider
```

If you want a user-scoped (global) config:
```bash
claude mcp add --transport stdio glider --scope user -- ~/.dotnet/tools/glider
```

You can also run through dotnet if you prefer not to call the shim directly:
```bash
claude mcp add --transport stdio glider --scope project -- dotnet tool run --global glider
```

### Example Prompts

Here are some effective prompts to use with Claude Code when Glider is configured:

#### Load a Solution
```
Load the C# solution at /path/to/YourProject.sln
```

#### Find Symbol References
```
Find all usages of the ISolutionManager interface
```

#### Analyze a Type
```
Get detailed information about the SolutionManager class
```

#### Find Implementations
```
Find all implementations of the ISymbolFinderService interface
```

#### Search for Types
```
Find all types that end with "Manager" in the solution
```

#### Get Method Details
```
Get the signature for the LoadSolutionAsync method in the ISolutionManager interface
```

#### Complex Analysis
```
I need to understand how the solution loading works. Can you:
1. Find the ISolutionManager interface
2. Find all its implementations
3. Show me the LoadSolutionAsync method signature
4. Find where LoadSolutionAsync is being called
```

### Working with Glider Tools Directly

You can also invoke tools directly through Claude by being explicit:

```
Use the load_solution tool to load /Users/yourname/projects/MyApp/MyApp.sln
```

```
Use the find_types tool with pattern "*Service" to find all service classes
```

```
Use the get_type_info tool to analyze the UserController class
```

## Tool Reference

### load_solution

Loads a C# solution file for analysis.

**Parameters:**
- `solutionPath` (string) - Absolute path to the .sln file

**Example:**
```json
{
  "solutionPath": "/Users/yourname/projects/MyApp/MyApp.sln"
}
```

### load_project

Loads a standalone C# project file for analysis. Use this when no solution file exists.

**Parameters:**
- `projectPath` (string) - Absolute path to the .csproj file

**Example:**
```json
{
  "projectPath": "/Users/yourname/projects/MyApp/MyApp.csproj"
}
```

### find_usages

Finds all references to a symbol in the loaded solution.

**Parameters:**
- `symbolName` (string) - Name of the symbol (simple or fully qualified)
- `projectName` (string, optional) - Limit search to specific project

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbolName": "ISolutionManager",
    "symbolKind": "Interface",
    "usageCount": 15,
    "usages": [
      {
        "filePath": "/path/to/Program.cs",
        "lineNumber": 9,
        "column": 35,
        "lineText": "builder.Services.AddSingleton<ISolutionManager, SolutionManager>();",
        "projectName": "Glider.StdioServer"
      }
    ]
  },
  "error": null
}
```

### get_type_info

Gets detailed information about a type including members, inheritance, and documentation.

**Parameters:**
- `typeName` (string) - Name of the type (simple or fully qualified)
- `projectName` (string, optional) - Limit search to specific project

**Example Response:**
```json
{
  "success": true,
  "data": {
    "name": "SolutionManager",
    "fullName": "Glider.Services.SolutionManager",
    "kind": "Class",
    "accessibility": "Public",
    "baseType": "Object",
    "interfaces": ["ISolutionManager"],
    "members": [
      {
        "name": "LoadSolutionAsync",
        "kind": "Method",
        "type": "Task",
        "accessibility": "Public",
        "signature": "Task LoadSolutionAsync(string solutionPath)"
      }
    ]
  }
}
```

### get_method_signature

Gets detailed signature information for a method.

**Parameters:**
- `methodName` (string) - Name of the method
- `containingTypeName` (string, optional) - Name of the containing type
- `projectName` (string, optional) - Limit search to specific project

**Example Response:**
```json
{
  "success": true,
  "data": {
    "name": "LoadSolutionAsync",
    "returnType": "Task",
    "containingType": "ISolutionManager",
    "parameters": [
      {
        "name": "solutionPath",
        "type": "string",
        "defaultValue": null,
        "modifiers": []
      }
    ]
  }
}
```

### find_implementation

Finds all concrete implementations of an interface or abstract class.

**Parameters:**
- `typeName` (string) - Name of the interface or abstract class
- `projectName` (string, optional) - Limit search to specific project

**Example Response:**
```json
{
  "success": true,
  "data": {
    "baseTypeName": "ISolutionManager",
    "baseTypeKind": "Interface",
    "implementationCount": 1,
    "implementations": [
      {
        "typeName": "SolutionManager",
        "fullName": "Glider.Services.SolutionManager",
        "kind": "Class",
        "filePath": "/path/to/SolutionManager.cs",
        "lineNumber": 10,
        "projectName": "Glider"
      }
    ]
  }
}
```

### find_types

Finds types by name pattern with wildcard support.

**Parameters:**
- `pattern` (string) - Search pattern (supports `*` and `?` wildcards)
- `projectName` (string, optional) - Limit search to specific project

**Pattern Examples:**
- `*Manager` - All types ending with "Manager"
- `I*Service` - All types starting with "I" and ending with "Service"
- `?ool` - Types with exactly 4 characters ending in "ool" (Tool, Pool, etc.)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "pattern": "*Manager",
    "matchCount": 2,
    "matches": [
      {
        "typeName": "SolutionManager",
        "fullName": "Glider.Services.SolutionManager",
        "kind": "Class",
        "accessibility": "Public",
        "filePath": "/path/to/SolutionManager.cs",
        "lineNumber": 10,
        "projectName": "Glider"
      }
    ]
  }
}
```

### rename_symbol

Renames a symbol throughout the solution with semantic awareness. Unlike grep-based renaming, this correctly distinguishes between different symbols with the same name.

**Parameters:**
- `symbolName` (string) - Name of the symbol to rename (simple or fully qualified)
- `newName` (string) - The new name for the symbol
- `projectName` (string, optional) - Limit search to specific project
- `applyChanges` (boolean, optional) - If true (default), applies changes. If false, returns preview only.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbolName": "OldClassName",
    "newName": "NewClassName",
    "symbolKind": "Class",
    "filesChanged": 5,
    "locationsChanged": 12,
    "applied": true,
    "unifiedDiff": "..."
  }
}
```

### move_type

Moves a type to a different file and/or namespace. Automatically updates all references and adds required using directives.

**Parameters:**
- `typeName` (string) - Name of the type to move (simple or fully qualified)
- `targetFilePath` (string, optional) - Target file path. If not specified, creates new file based on type name.
- `targetNamespace` (string, optional) - Target namespace. If not specified, keeps original namespace.
- `projectName` (string, optional) - Limit search to specific project
- `applyChanges` (boolean, optional) - If true (default), applies changes. If false, returns preview only.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbolName": "MyClass",
    "symbolKind": "Class",
    "sourceLocation": "/path/to/OldFile.cs",
    "targetLocation": "/path/to/NewFile.cs",
    "filesChanged": 3,
    "filesCreated": 1,
    "applied": true,
    "unifiedDiff": "..."
  }
}
```

### move_member

Moves a member (method, property, field, etc.) from one type to another. Automatically updates all references.

**Parameters:**
- `memberName` (string) - Name of the member to move
- `sourceTypeName` (string) - Name of the type containing the member
- `targetTypeName` (string) - Name of the type to move the member to
- `projectName` (string, optional) - Limit search to specific project
- `applyChanges` (boolean, optional) - If true (default), applies changes. If false, returns preview only.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbolName": "MyMethod",
    "symbolKind": "Method",
    "sourceLocation": "SourceClass",
    "targetLocation": "TargetClass",
    "filesChanged": 2,
    "filesCreated": 0,
    "applied": true,
    "unifiedDiff": "..."
  }
}
```

### view_external_definition

Views the source code of external symbols (types, methods, properties, etc.) from NuGet packages or framework assemblies. Attempts SourceLink resolution first for original source, then falls back to ILSpy decompilation.

**Parameters:**
- `symbolName` (string) - Name of the symbol to look up (simple or fully qualified)
- `assemblyHint` (string, optional) - Assembly name hint to filter results when multiple matches exist
- `projectName` (string, optional) - Limit search to specific project

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbolName": "JsonSerializer",
    "symbolKind": "Class",
    "assemblyName": "System.Text.Json",
    "assemblyVersion": "9.0.0.0",
    "sourceOrigin": "SourceLink",
    "sourceUrl": "https://raw.githubusercontent.com/...",
    "sourceCode": "public static class JsonSerializer { ... }",
    "language": "C#"
  }
}
```

### get_diagnostics

Gets compiler diagnostics (warnings, errors, info) for the loaded solution.

**Parameters:**
- `filePath` (string, optional) - Limit diagnostics to a specific file path
- `projectName` (string, optional) - Limit diagnostics to a specific project
- `severity` (string, optional) - Minimum severity (`error`, `warning`, `info`, `hidden`). Default: `warning`

**Example Request:**
```json
{
  "filePath": "/path/to/File.cs",
  "severity": "error"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "diagnosticCount": 3,
    "errorCount": 1,
    "warningCount": 2,
    "infoCount": 0,
    "diagnostics": [
      {
        "id": "CS1002",
        "severity": "Error",
        "message": "; expected",
        "filePath": "/path/to/File.cs",
        "lineNumber": 42,
        "column": 17,
        "endLineNumber": 42,
        "endColumn": 18,
        "category": "Syntax",
        "projectName": "MyProject"
      }
    ]
  },
  "error": null
}
```

### get_type_dependencies

Analyzes type dependencies to show what types a given type uses and what types use it.

**Parameters:**
- `typeName` (string) - Name of the type to analyze
- `projectName` (string, optional) - Limit search to specific project
- `direction` (string, optional) - `uses`, `used_by`, or `both` (default)

**Example Request:**
```json
{
  "typeName": "SolutionManager",
  "direction": "both"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "typeName": "SolutionManager",
    "fullName": "Glider.Services.SolutionManager",
    "filePath": "/path/to/SolutionManager.cs",
    "usesCount": 4,
    "usedByCount": 2,
    "uses": [
      {
        "typeName": "Workspace",
        "fullName": "Microsoft.CodeAnalysis.Workspace",
        "namespace": "Microsoft.CodeAnalysis",
        "usageKind": "Field",
        "filePath": null,
        "isExternal": true
      }
    ],
    "usedBy": [
      {
        "typeName": "SolutionTools",
        "fullName": "Glider.Server.SolutionTools",
        "namespace": "Glider.Server",
        "usageKind": "Method",
        "filePath": "/path/to/SolutionTools.cs",
        "isExternal": false
      }
    ]
  },
  "error": null
}
```

### analyze_complexity

Analyzes code complexity metrics including cyclomatic complexity, lines of code, and method counts.

**Parameters:**
- `typeName` (string, optional) - Analyze a specific type
- `filePath` (string, optional) - Analyze a specific file
- `projectName` (string, optional) - Limit search to specific project

**Example Request:**
```json
{
  "projectName": "MyProject"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTypes": 12,
      "totalMethods": 84,
      "totalLinesOfCode": 3200,
      "averageComplexity": 3.1,
      "maxComplexity": 12,
      "highComplexityMethodCount": 4
    },
    "types": [
      {
        "name": "SolutionManager",
        "fullName": "Glider.Services.SolutionManager",
        "kind": "Class",
        "filePath": "/path/to/SolutionManager.cs",
        "linesOfCode": 240,
        "methodCount": 8,
        "averageComplexity": 2.4,
        "methods": [
          {
            "name": "LoadSolutionAsync",
            "cyclomaticComplexity": 4,
            "linesOfCode": 32,
            "parameterCount": 1,
            "lineNumber": 58
          }
        ]
      }
    ]
  },
  "error": null
}
```

## Important: Version Expiration

Each version of Glider expires 1 month after release. This ensures users stay on recent versions with the latest fixes and features.

When your version expires, update with:
```bash
dotnet tool update --global glider
```

You'll receive a warning 7 days before expiration.

## Architecture

Glider follows a clean service-oriented architecture:

### Core Services (Glider Library)
- **ISolutionManager** - Manages solution/project lifecycle (load/unload)
- **ISymbolFinderService** - Symbol finding and search operations
- **ITypeAnalysisService** - Type information extraction
- **IMethodAnalysisService** - Method signature analysis
- **IRefactoringService** - Code refactoring (rename, move type, move member)
- **IExternalSourceService** - External source retrieval (SourceLink/decompilation)
- **IDiagnosticsService** - Compiler diagnostics retrieval
- **IDependencyAnalysisService** - Type dependency analysis (uses/used-by)
- **ICodeMetricsService** - Code complexity metrics

### MCP Tool Layer (Glider.Server)
- **DiagnosticTools** - Server health/status and diagnostics
- **SolutionTools** - Solution and project management
- **CodeFinderTools** - Symbol finding and type search
- **CodeAnalysisTools** - Type and method analysis
- **RefactoringTools** - Rename and move operations
- **ExternalSourceTools** - External source viewing
- **DependencyTools** - Type dependency analysis
- **MetricsTools** - Code complexity metrics

### Response Format

All tools return structured JSON responses:
```json
{
  "success": true/false,
  "data": { ... } or null,
  "error": null or "error message"
}
```

## Development

### Building the Project

```bash
# Restore dependencies
dotnet restore

# Build
dotnet build

# Run tests
dotnet test

# Pack for distribution
dotnet pack src/Glider.Server/Glider.Server.csproj
```

### Local Testing

Install the tool locally from your build output:

```bash
# Build and pack
dotnet pack src/Glider.Server/Glider.Server.csproj

# Install from local source
dotnet tool install --global --add-source ./src/Glider.Server/nupkg glider --version 0.3.0

# Test the tool
glider
```

To test with Claude Code, add the local tool via the CLI and restart Claude Code:
```bash
claude mcp add --transport stdio glider --scope project -- ~/.dotnet/tools/glider
```

### Project Structure

```
glider/
├── src/
│   ├── Glider/                      # Core library
│   │   ├── Interfaces/              # Service interfaces (6 core services)
│   │   ├── Services/                # Service implementations
│   │   └── Models/                  # Data models
│   ├── Glider.Server/               # MCP server (stdio + HTTP transports)
│   │   ├── Program.cs               # Entry point, DI setup, transport selection
│   │   ├── LicenseValidator.cs      # Time-based license validation
│   │   ├── DiagnosticTools.cs       # Status tools
│   │   ├── SolutionTools.cs         # Solution/project management tools
│   │   ├── CodeFinderTools.cs       # Search and find tools
│   │   ├── CodeAnalysisTools.cs     # Analysis tools
│   │   ├── RefactoringTools.cs      # Rename/move operations
│   │   └── ExternalSourceTools.cs   # External source viewing
│   └── Glider.Tests/                # Integration tests
└── README.md
```

## Troubleshooting

### Tool Not Found After Installation

Ensure your PATH includes the .NET tools directory:

**macOS/Linux:**
```bash
export PATH="$PATH:$HOME/.dotnet/tools"
```

**Windows:**
```powershell
$env:PATH += ";$env:USERPROFILE\.dotnet\tools"
```

### Solution Won't Load

Ensure the solution path is absolute and the .sln file exists:
```bash
# Wrong
load_solution("MyApp.sln")

# Correct
load_solution("/full/path/to/MyApp.sln")
```

### Symbol Not Found

Try using the fully qualified name:
```bash
# Instead of just "Manager"
find_usages("Glider.Services.SolutionManager")
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and changelog generation.

#### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Commit Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor (0.1.0 → 0.2.0) |
| `fix` | Bug fix | Patch (0.1.0 → 0.1.1) |
| `perf` | Performance improvement | Patch |
| `refactor` | Code refactoring | Patch |
| `docs` | Documentation only | No release |
| `style` | Code style (formatting) | No release |
| `test` | Adding/updating tests | No release |
| `chore` | Maintenance tasks | No release |
| `ci` | CI/CD changes | No release |

#### Breaking Changes

For breaking changes, add `!` after the type or include `BREAKING CHANGE:` in the footer:

```bash
# Option 1: Using !
feat!: remove deprecated API endpoints

# Option 2: Using footer
feat: redesign configuration system

BREAKING CHANGE: Configuration file format has changed from JSON to YAML.
```

Breaking changes trigger a **major** version bump (0.x.x → 1.0.0).

#### Examples

```bash
# Feature
git commit -m "feat(server): add HTTP transport support"

# Bug fix
git commit -m "fix(analysis): handle null references in type lookup"

# Documentation
git commit -m "docs: update installation instructions"

# Breaking change
git commit -m "feat!: change tool response format"
```

## License

All Rights Reserved - see LICENSE file for details

## Acknowledgments

Built with:
- [Roslyn](https://github.com/dotnet/roslyn) - .NET Compiler Platform
- [Model Context Protocol](https://github.com/modelcontextprotocol) - MCP SDK
- .NET 10.0
