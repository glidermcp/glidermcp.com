import { DEFAULT_SITE_ORIGIN, getSitemapPaths } from './routes';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export function buildSitemapXml(origin: string = DEFAULT_SITE_ORIGIN): string {
	const normalizedOrigin = origin.replace(/\/+$/, '');
	const urls = getSitemapPaths().map(path => `${normalizedOrigin}${path === '/' ? '' : path}`);

	const lines: string[] = [];
	lines.push('<?xml version="1.0" encoding="UTF-8"?>');
	lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
	for (const url of urls) {
		lines.push('  <url>');
		lines.push(`    <loc>${escapeXml(url)}</loc>`);
		lines.push('  </url>');
	}
	lines.push('</urlset>');

	return `${lines.join('\n')}\n`;
}

