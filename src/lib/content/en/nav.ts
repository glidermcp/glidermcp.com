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
				{ id: 'tool-load-solution', label: 'load_solution', href: '/tools/load-solution' },
				{ id: 'tool-load-project', label: 'load_project', href: '/tools/load-project' },
				{ id: 'tool-reload-current', label: 'reload_current', href: '/tools/reload-current' },
				{ id: 'tool-sync-documents', label: 'sync_documents', href: '/tools/sync-documents' },
				{ id: 'tool-solution-cache', label: 'solution_cache', href: '/tools/solution-cache' },
				{ id: 'tool-get-diagnostics', label: 'get_diagnostics', href: '/tools/get-diagnostics' },
				{ id: 'tool-search-symbols', label: 'search_symbols', href: '/tools/search-symbols' },
				{ id: 'tool-get-symbol-at-position', label: 'get_symbol_at_position', href: '/tools/get-symbol-at-position' },
				{ id: 'tool-get-symbol-info', label: 'get_symbol_info', href: '/tools/get-symbol-info' },
				{ id: 'tool-find-types', label: 'find_types', href: '/tools/find-types' },
				{ id: 'tool-find-usages', label: 'find_usages', href: '/tools/find-usages' },
				{ id: 'tool-find-implementation', label: 'find_implementation', href: '/tools/find-implementation' },
				{ id: 'tool-get-type-info', label: 'get_type_info', href: '/tools/get-type-info' },
				{ id: 'tool-get-method-signature', label: 'get_method_signature', href: '/tools/get-method-signature' },
				{ id: 'tool-get-type-source', label: 'get_type_source', href: '/tools/get-type-source' },
				{ id: 'tool-get-method-source', label: 'get_method_source', href: '/tools/get-method-source' },
				{ id: 'tool-get-code-fixes', label: 'get_code_fixes', href: '/tools/get-code-fixes' },
				{ id: 'tool-apply-code-fix', label: 'apply_code_fix', href: '/tools/apply-code-fix' },
				{ id: 'tool-organize-usings', label: 'organize_usings', href: '/tools/organize-usings' },
				{ id: 'tool-format-document', label: 'format_document', href: '/tools/format-document' },
				{ id: 'tool-get-type-dependencies', label: 'get_type_dependencies', href: '/tools/get-type-dependencies' },
				{ id: 'tool-analyze-complexity', label: 'analyze_complexity', href: '/tools/analyze-complexity' },
				{ id: 'tool-rename-symbol', label: 'rename_symbol', href: '/tools/rename-symbol' },
				{ id: 'tool-move-type', label: 'move_type', href: '/tools/move-type' },
				{ id: 'tool-move-member', label: 'move_member', href: '/tools/move-member' },
				{ id: 'tool-view-external-definition', label: 'view_external_definition', href: '/tools/view-external-definition' },
				{ id: 'tool-batch', label: 'batch', href: '/tools/batch' }
			]
		},
	{ id: 'playground', label: 'Playground', href: '/playground' },
	{ id: 'prompts', label: 'Prompts', href: '/prompts' },
	{ id: 'faq', label: 'FAQ', href: '/faq' },
	{ id: 'privacy', label: 'Privacy', href: '/privacy' },
	{ id: 'pricing', label: 'Pricing', href: '/pricing' }
];
