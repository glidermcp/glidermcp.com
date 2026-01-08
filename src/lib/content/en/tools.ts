import type { ToolDetailContent, ToolsListContent } from '../types';

export const toolsList: ToolsListContent = {
	title: 'Available Tools',
	intro: 'Glider provides 15 MCP tools for C# code analysis and refactoring.'
};

export const toolDetail: ToolDetailContent = {
	parametersTitle: 'Parameters',
	examplesTitle: 'Examples',
	responseTitle: 'Response',
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
	notFoundText: 'Tool not found.',
	hint: 'Go to <strong>Playground</strong> to test this tool interactively.'
};
