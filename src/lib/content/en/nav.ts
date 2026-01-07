import type { NavItem } from '$types/navigation';

export const navItems: NavItem[] = [
	{ id: 'intro', label: 'Introduction', href: '/' },
	{ id: 'quick-start', label: 'Quick Start', href: '/quick-start' },
	{
		id: 'installation',
		label: 'Installation',
		href: '/installation',
		children: [
			{ id: 'install-claude-code', label: 'Claude Code', href: '/installation/claude-code' },
			{ id: 'install-codex', label: 'Codex CLI', href: '/installation/codex' },
			{ id: 'install-gemini', label: 'Gemini CLI', href: '/installation/gemini' },
			{ id: 'install-cursor', label: 'Cursor', href: '/installation/cursor' },
			{ id: 'install-copilot', label: 'GitHub Copilot', href: '/installation/copilot' },
			{ id: 'install-other', label: 'Other Clients', href: '/installation/other' }
		]
	},
	{
		id: 'tools',
		label: 'Tools',
		href: '/tools',
		children: [
			{ id: 'tool-server-status', label: 'server_status', href: '/tools/server-status' },
			{ id: 'tool-load-solution', label: 'load_solution', href: '/tools/load-solution' },
			{ id: 'tool-load-project', label: 'load_project', href: '/tools/load-project' },
			{ id: 'tool-unload-solution', label: 'unload_solution', href: '/tools/unload-solution' },
			{ id: 'tool-find-types', label: 'find_types', href: '/tools/find-types' },
			{ id: 'tool-find-usages', label: 'find_usages', href: '/tools/find-usages' },
			{ id: 'tool-find-implementation', label: 'find_implementation', href: '/tools/find-implementation' },
			{ id: 'tool-get-type-info', label: 'get_type_info', href: '/tools/get-type-info' },
			{ id: 'tool-get-method-signature', label: 'get_method_signature', href: '/tools/get-method-signature' },
			{ id: 'tool-rename-symbol', label: 'rename_symbol', href: '/tools/rename-symbol' },
			{ id: 'tool-move-type', label: 'move_type', href: '/tools/move-type' },
			{ id: 'tool-move-member', label: 'move_member', href: '/tools/move-member' },
			{ id: 'tool-view-external', label: 'view_external_definition', href: '/tools/view-external' }
		]
	},
	{ id: 'playground', label: 'Playground', href: '/playground' },
	{ id: 'prompts', label: 'Prompts', href: '/prompts' },
	{ id: 'faq', label: 'FAQ', href: '/faq' },
	{ id: 'pricing', label: 'Pricing', href: '/pricing' }
];
