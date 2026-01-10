import { TOOLS } from '../utils/tool-metadata';

export const DEFAULT_SITE_ORIGIN = 'https://glidermcp.com';

export const STATIC_SITEMAP_PATHS = [
	'/',
	'/faq',
	'/installation',
	'/playground',
	'/pricing',
	'/privacy',
	'/prompts',
	'/quick-start',
	'/tools'
] as const;

export const INSTALLATION_SLUG_TO_ID: Record<string, string> = {
	'claude-code': 'install-claude-code',
	codex: 'install-codex',
	gemini: 'install-gemini',
	cursor: 'install-cursor',
	copilot: 'install-copilot',
	other: 'install-other'
};

export function toolIdToSlug(toolId: string): string {
	return toolId.replace(/_/g, '-');
}

export function getSitemapPaths(): string[] {
	const paths = new Set<string>();

	for (const path of STATIC_SITEMAP_PATHS) paths.add(path);

	for (const slug of Object.keys(INSTALLATION_SLUG_TO_ID)) {
		paths.add(`/installation/${slug}`);
	}

	for (const tool of TOOLS) {
		if (tool.showInDocs === false) continue;
		paths.add(`/tools/${toolIdToSlug(tool.id)}`);
	}

	return Array.from(paths).sort((a, b) => a.localeCompare(b));
}
