# Claude Code Instructions for glidermcp.com

This document provides guidelines for AI assistants (Claude, etc.) when generating or modifying content for the Glider MCP website.

## Project Overview

Glider MCP is a Model Context Protocol server that provides Roslyn-powered C# code analysis for AI assistants. This SvelteKit website serves as documentation and marketing for the tool.

## Project Structure

```
glidermcp.com/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── pages/          # Page components (Intro, FAQ, etc.)
│   │   │   ├── tui/            # TUI (Terminal UI) components
│   │   │   └── game/           # Easter egg game components
│   │   ├── content/
│   │   │   ├── en/             # English content files
│   │   │   ├── types.ts        # TypeScript interfaces for content
│   │   │   └── index.ts        # Content exports
│   │   ├── stores/             # Svelte stores
│   │   └── services/           # Business logic services
│   └── routes/                 # SvelteKit routes
├── static/                     # Static assets (icons, sounds)
└── e2e/                        # Playwright E2E tests
```

## Content System

### Content Location
All textual content lives in `src/lib/content/en/`. Each page has its own TypeScript file:

| File | Purpose |
|------|---------|
| `intro.ts` | Homepage/Introduction content |
| `quick-start.ts` | Getting started guide |
| `installation.ts` | Installation guides for different clients |
| `tools.ts` | Tool documentation labels |
| `prompts.ts` | Prompt examples for users |
| `faq.ts` | Frequently asked questions |
| `pricing.ts` | Pricing and licensing info |
| `nav.ts` | Navigation tree structure |
| `meta.ts` | SEO metadata |

### Content Type Definitions
All content types are defined in `src/lib/content/types.ts`. Always check this file before creating or modifying content to ensure type compliance.

Key types:
- `IntroContent` - Introduction page
- `QuickStartContent` - Quick start guide with sections
- `InstallationContent` - Installation overview
- `InstallationGuide` - Per-client installation steps
- `PromptsContent` - Prompt groups and examples
- `FaqContent` - FAQ items
- `PricingContent` - Pricing page

### Adding New Content

1. **Define the type** in `types.ts` if it doesn't exist
2. **Create/modify the content file** in `src/lib/content/en/`
3. **Export from index** in `src/lib/content/en/index.ts`
4. **Create/modify the component** in `src/lib/components/pages/`

## Content Guidelines

### Tone & Voice
- **Technical but approachable**: Write for developers who may be new to MCP
- **Concise**: Avoid fluff; developers appreciate direct information
- **Active voice**: "Glider provides..." not "... is provided by Glider"
- **No marketing hype**: State facts and capabilities without exaggeration

### Formatting Conventions
- Use `<strong>` for emphasis (rendered in TUI style)
- Use `<code>` for inline code references
- Code blocks use the `CodeSample` type with `code` and `language` fields
- Supported languages: `bash`, `json`, `csharp`, `typescript`

### HTML in Content
Some content fields accept HTML for formatting:
```typescript
answer: [
  'Use the <code>find_types</code> tool with <strong>wildcard patterns</strong>.'
]
```

### Code Samples
Always specify the language for syntax highlighting:
```typescript
quickInstall: {
  code: 'dotnet tool install --global glider',
  language: 'bash'
}
```

## Page Components

Page components in `src/lib/components/pages/` consume content from the content files. They follow a consistent pattern:

```svelte
<script lang="ts">
  import { homeContent } from '$lib/content';
  const content = homeContent.intro;
</script>
```

## Navigation

Navigation is defined in `src/lib/content/en/nav.ts` using the `NavItem` type:

```typescript
interface NavItem {
  id: string;      // Unique identifier used for routing
  label: string;   // Display text in navigation
  children?: NavItem[];  // Optional nested items
}
```

To add a new page:
1. Add a `NavItem` entry in `nav.ts`
2. Create the content in a new or existing content file
3. Add the component in `src/lib/components/pages/`
4. Update `HomeContent.svelte` to route to the new component

## Common Tasks

### Adding a FAQ Item
Edit `src/lib/content/en/faq.ts`:
```typescript
{
  question: 'Your question here?',
  answer: [
    'First paragraph of answer.',
    'Second paragraph if needed.'
  ]
}
```

### Adding an Installation Guide
Edit `src/lib/content/en/installation.ts`:
1. Add a `ClientCard` to the `clients` array
2. Add an `InstallationGuide` to `installationGuides`

### Adding a Tool
Tools are defined in `src/lib/data/tools.ts` (the data), not content files. Tool UI labels are in `src/lib/content/en/tools.ts`.

### Adding Prompt Examples
Edit `src/lib/content/en/prompts.ts`:
```typescript
{
  title: 'Group Title',
  description: 'Brief description of this prompt category.',
  prompts: [
    'Example prompt 1',
    'Example prompt 2'
  ]
}
```

## Testing

- Unit tests: `yarn test`
- E2E tests: `yarn test:e2e`
- Type checking: `yarn check`

When modifying content, ensure the build passes: `yarn build`

## Important Notes

1. **Type Safety**: All content must match TypeScript interfaces in `types.ts`
2. **No Hardcoded Text**: All user-facing text should be in content files, not components
3. **Consistency**: Match existing patterns in similar content files
4. **Escape HTML**: In regular text fields, use HTML entities if needed (`&amp;`, `&lt;`)
5. **Test Locally**: Run `yarn dev` to preview changes before committing
