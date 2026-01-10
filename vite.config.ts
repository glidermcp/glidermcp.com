import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pwaManifestBase, type PwaManifestIcon } from './src/lib/pwa/manifest';
import { buildSitemapXml } from './src/lib/seo/sitemap';

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

function pwaManifestGenerator() {
	const staticDir = path.resolve(process.cwd(), 'static');

	return {
		name: 'glider:pwa-asset-generator',
		async buildStart() {
			await writePwaManifest(staticDir);
			await writeSitemap(staticDir);
		},
		async configureServer() {
			await writePwaManifest(staticDir);
			await writeSitemap(staticDir);
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
	plugins: [pwaManifestGenerator(), tailwindcss(), sveltekit()],
	server: {
		fs: {
			allow: ['..']
		}
	}
});
