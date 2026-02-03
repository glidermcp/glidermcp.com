import type { ToolDetailContent, ToolsListContent } from '../types';

export const toolsList: ToolsListContent = {
	title: 'Available Tools',
	intro: 'Glider provides 35 MCP tools for C# code analysis and refactoring.'
};

export const toolDetail: ToolDetailContent = {
	parametersTitle: 'Parameters',
	examplesTitle: 'Examples',
	exampleRequestTitle: 'Request',
	exampleResponseTitle: 'Response',
	responseTitle: 'Response Notes',
	playgroundHintPrefixHtml: 'Try this tool in ',
	playgroundLinkLabelHtml: '<strong>Playground</strong>.',
	tableHeaders: {
		name: 'Name',
		type: 'Type',
		required: 'Required',
		description: 'Description'
	},
	requiredLabels: {
		yes: 'Yes',
		no: 'No'
	},
	noParametersText: 'This tool requires no parameters.',
	notFoundText: 'Tool not found.'
};
