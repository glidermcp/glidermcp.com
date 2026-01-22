import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pwaManifestBase, type PwaManifestIcon } from './src/lib/pwa/manifest';
import { buildSitemapXml } from './src/lib/seo/sitemap';

const NUGET_API_URL = 'https://api.nuget.org/v3-flatcontainer/glider/index.json';
const FALLBACK_VERSION = '0.0.0';

async function fetchLatestNuGetVersion(): Promise<string> {
	try {
		const response = await fetch(NUGET_API_URL, {
			signal: AbortSignal.timeout(10000)
		});
		if (!response.ok) return FALLBACK_VERSION;
		const data = await response.json();
		const versions = data.versions as string[];
		const stableVersions = versions.filter((v) => !v.includes('-'));
		return stableVersions[stableVersions.length - 1] ?? FALLBACK_VERSION;
	} catch {
		return FALLBACK_VERSION;
	}
}

async function writeVersionFile(generatedDir: string): Promise<void> {
	const versionPath = path.join(generatedDir, 'version.ts');
	const version = await fetchLatestNuGetVersion();
	const fetchedAt = new Date().toISOString();

	const contents = `// Auto-generated. Do not edit.
export const gliderVersion = {
	version: '${version}',
	fetchedAt: '${fetchedAt}'
};
`;

	await fs.mkdir(generatedDir, { recursive: true });

	try {
		const existing = await fs.readFile(versionPath, 'utf8');
		// Only check the version line to avoid updating on every build due to timestamp
		const existingVersion = existing.match(/version: '([^']+)'/)?.[1];
		if (existingVersion === version) return;
	} catch {
		// ignore missing file
	}

	await fs.writeFile(versionPath, contents, 'utf8');
}

async function collectPwaIcons(iconsDir: string): Promise<PwaManifestIcon[]> {
	const entries = await fs.readdir(iconsDir, { withFileTypes: true });
	const icons: PwaManifestIcon[] = [];

	for (const entry of entries) {
		if (!entry.isFile()) continue;
		if (!entry.name.endsWith('.png')) continue;

		const match = entry.name.match(/^icon(-maskable)?-(\d+)\.png$/);
		if (!match) continue;

		const isMaskable = Boolean(match[1]);
		const size = Number(match[2]);
		if (!Number.isFinite(size) || size <= 0) continue;

		icons.push({
			src: `/icons/${entry.name}`,
			sizes: `${size}x${size}`,
			type: 'image/png',
			purpose: isMaskable ? 'maskable' : 'any'
		});
	}

	icons.sort((a, b) => {
		const aPurpose = a.purpose === 'maskable' ? 1 : 0;
		const bPurpose = b.purpose === 'maskable' ? 1 : 0;
		if (aPurpose !== bPurpose) return aPurpose - bPurpose;

		const aSize = Number.parseInt(a.sizes.split('x')[0] ?? '0', 10);
		const bSize = Number.parseInt(b.sizes.split('x')[0] ?? '0', 10);
		return aSize - bSize;
	});

	return icons;
}

async function writePwaManifest(staticDir: string) {
	const iconsDir = path.join(staticDir, 'icons');
	const manifestPath = path.join(staticDir, 'manifest.json');

	const icons = await collectPwaIcons(iconsDir);
	const manifest = { ...pwaManifestBase, icons };
	const contents = `${JSON.stringify(manifest, null, 2)}\n`;

	try {
		const existing = await fs.readFile(manifestPath, 'utf8');
		if (existing === contents) return;
	} catch {
		// ignore missing file
	}

	await fs.writeFile(manifestPath, contents, 'utf8');
}

function gliderAssetGenerator() {
	const staticDir = path.resolve(process.cwd(), 'static');
	const generatedDir = path.resolve(process.cwd(), 'src/lib/generated');

	return {
		name: 'glider:asset-generator',
		async buildStart() {
			await writePwaManifest(staticDir);
			await writeSitemap(staticDir);
			await writeVersionFile(generatedDir);
		},
		async configureServer() {
			await writePwaManifest(staticDir);
			await writeSitemap(staticDir);
			await writeVersionFile(generatedDir);
		}
	};
}

async function writeSitemap(staticDir: string) {
	const sitemapPath = path.join(staticDir, 'sitemap.xml');
	const origin = process.env.SITE_ORIGIN ?? process.env.PUBLIC_SITE_ORIGIN ?? 'https://glidermcp.com';
	const contents = buildSitemapXml(origin);

	try {
		const existing = await fs.readFile(sitemapPath, 'utf8');
		if (existing === contents) return;
	} catch {
		// ignore missing file
	}

	await fs.writeFile(sitemapPath, contents, 'utf8');
}

export default defineConfig({
	plugins: [gliderAssetGenerator(), tailwindcss(), sveltekit()],
	server: {
		fs: {
			allow: ['..']
		}
	}
});
