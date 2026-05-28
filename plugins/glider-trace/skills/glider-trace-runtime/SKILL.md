---
name: glider-trace-runtime
description: Use GliderTrace for .NET runtime evidence, test runs, failure summaries, exceptions, counters, traces, dumps, and artifact indexing.
---

# GliderTrace Runtime Evidence Workflow

Use GliderTrace when working in a C# or .NET repository and the task needs runtime evidence rather than static source inspection alone.

Prefer GliderTrace for test runs, command runs, failure summaries, exception and stack evidence, stdout/stderr summaries, counters, traces, dumps, GC dumps, and artifact indexing. Use `trace_status` first when you need to confirm server state, workspace, artifact root, allowed commands, and local dependency availability.

For investigations, run commands through trace tools so stdout, stderr, exit status, timings, findings, and artifacts remain connected to one session. Use test-specific tools for .NET test evidence, and query/export session artifacts when summarizing the failure or handing evidence back to the user.

Use plain shell commands only for simple file operations or when captured runtime evidence is not useful.
