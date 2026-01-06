import type { NavItem } from '$types/navigation';

export const navItems: NavItem[] = [
	{ id: 'intro', label: 'Introduction' },
	{ id: 'quick-start', label: 'Quick Start' },
	{
		id: 'installation',
		label: 'Installation',
		children: [
			{ id: 'install-claude-code', label: 'Claude Code' },
			{ id: 'install-codex', label: 'Codex CLI' },
			{ id: 'install-gemini', label: 'Gemini CLI' },
			{ id: 'install-cursor', label: 'Cursor' },
			{ id: 'install-copilot', label: 'GitHub Copilot' },
			{ id: 'install-other', label: 'Other Clients' }
		]
	},
	{
		id: 'tools',
		label: 'Tools',
		children: [
			{ id: 'tool-server-status', label: 'server_status' },
			{ id: 'tool-load-solution', label: 'load_solution' },
			{ id: 'tool-load-project', label: 'load_project' },
			{ id: 'tool-unload-solution', label: 'unload_solution' },
			{ id: 'tool-find-types', label: 'find_types' },
			{ id: 'tool-find-usages', label: 'find_usages' },
			{ id: 'tool-find-implementation', label: 'find_implementation' },
			{ id: 'tool-get-type-info', label: 'get_type_info' },
			{ id: 'tool-get-method-signature', label: 'get_method_signature' },
			{ id: 'tool-rename-symbol', label: 'rename_symbol' },
			{ id: 'tool-move-type', label: 'move_type' },
			{ id: 'tool-move-member', label: 'move_member' },
			{ id: 'tool-view-external', label: 'view_external_definition' }
		]
	},
	{ id: 'playground', label: 'Playground' },
	{ id: 'prompts', label: 'Prompts' },
	{ id: 'faq', label: 'FAQ' },
	{ id: 'pricing', label: 'Pricing' }
];
