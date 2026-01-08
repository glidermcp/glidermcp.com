import type { SectionBlock } from '../types';

export const privacy: { title: string; intro: string[]; sections: SectionBlock[] } = {
	title: 'Privacy',
	intro: [
		'Glider MCP is built to keep your customer data private by default.',
		'No prompts, code, or customer data are sent to Glider, stored on our servers, or used for training or analytics.'
	],
	sections: [
		{
			title: 'Data stays local',
			paragraphs: [
				'All MCP tooling runs on your machine. Requests are handled locally, and project files remain in your workspace.'
			],
			list: [
				'No MCP client telemetry or usage analytics are shipped to Glider.',
				'No customer data is retained or cached outside your machine.',
				'We do not use your data to train or improve models.'
			]
		},
		{
			title: 'No hidden network activity',
			paragraphs: [
				'Glider MCP does not initiate outbound connections on its own. The only network calls are the ones you explicitly configure through your MCP client or tooling.'
			]
		},
		{
			title: 'You control retention',
			paragraphs: [
				'Glider MCP does not generate or retain logs or customer data. There is nothing to delete on our side or yours.'
			]
		}
	]
};
