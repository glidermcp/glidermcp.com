# GliderMCP Plugin

This plugin connects agent clients to a local GliderMCP C# semantic analysis server.

Prerequisites:

- .NET 10 SDK
- `dotnet tool install --global glider`
- `glider` available on `PATH`

The bundled MCP config starts Glider over stdio with a 30 minute default async-tool timeout.
