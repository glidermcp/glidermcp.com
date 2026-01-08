import type { PricingContent } from '../types';

export const pricing: PricingContent = {
	title: 'Pricing',
	planName: 'Free',
	price: '$0',
	features: [
		'All 15 tools included',
		'Unlimited solutions',
		'Both stdio and HTTP transport',
		'Works with any MCP client',
		'Community support via GitHub'
	],
	versionPolicyTitle: 'Version Policy',
	versionPolicy: [
		'Each version of Glider expires 1 month after release. This ensures users stay on recent versions with the latest improvements and fixes.',
		"You'll receive a warning 7 days before expiration. Update with:"
	],
	updateCode: {
		code: 'dotnet tool update --global glider',
		language: 'bash'
	},
	authorTitle: 'Author',
	authorLabel: 'Built by',
	authorName: 'Bogdan Novosad',
	authorUrl: 'https://sacrorum.com',
	licenseTitle: 'License',
	licenseText: 'All Rights Reserved'
};
