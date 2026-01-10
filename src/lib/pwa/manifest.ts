export type PwaManifestShortcut = {
	name: string;
	short_name?: string;
	description?: string;
	url: string;
	icons?: Array<{
		src: string;
		sizes?: string;
		type?: string;
		purpose?: 'any' | 'maskable' | 'monochrome' | string;
	}>;
};

export type PwaManifestIcon = {
	src: string;
	sizes: string;
	type: string;
	purpose?: 'any' | 'maskable' | 'monochrome' | string;
};

export type PwaManifestBase = {
	name: string;
	short_name?: string;
	description?: string;
	start_url?: string;
	display?: string;
	background_color?: string;
	theme_color?: string;
	orientation?: string;
	scope?: string;
	categories?: string[];
	shortcuts?: PwaManifestShortcut[];
};

export const pwaManifestBase: PwaManifestBase = {
	name: 'Glider MCP',
	short_name: 'Glider',
	description: 'Roslyn-powered C# code analysis MCP server documentation and playground',
	start_url: '/',
	display: 'standalone',
	background_color: '#000000',
	theme_color: '#00ff00',
	orientation: 'any',
	scope: '/',
	categories: ['developer', 'utilities'],
	shortcuts: [
		{
			name: 'Playground',
			short_name: 'Play',
			description: 'Open MCP Playground',
			url: '/playground',
			icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
		},
		{
			name: 'Tools',
			short_name: 'Tools',
			description: 'View available tools',
			url: '/tools',
			icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
		}
	]
};
