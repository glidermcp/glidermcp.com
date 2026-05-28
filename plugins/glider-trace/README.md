# GliderTrace Plugin

This plugin connects agent clients to a local GliderTrace runtime evidence MCP server.

Prerequisites:

- .NET 10 SDK
- `dotnet tool install --global glider-trace`
- `glider-trace` available on `PATH`

The bundled MCP config starts GliderTrace over stdio with a 30 minute default async-tool timeout.
