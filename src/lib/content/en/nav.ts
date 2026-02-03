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
			{ id: 'tool-get-diagnostics', label: 'get_diagnostics', href: '/tools/get-diagnostics' },

			{ id: 'tool-load', label: 'load', href: '/tools/load' },
			{ id: 'tool-sync', label: 'sync', href: '/tools/sync' },
			{ id: 'tool-reload', label: 'reload', href: '/tools/reload' },

			{ id: 'tool-resolve-symbol', label: 'resolve_symbol', href: '/tools/resolve-symbol' },
			{ id: 'tool-search-symbols', label: 'search_symbols', href: '/tools/search-symbols' },
			{ id: 'tool-get-symbol-at-position', label: 'get_symbol_at_position', href: '/tools/get-symbol-at-position' },
			{ id: 'tool-get-symbol-info', label: 'get_symbol_info', href: '/tools/get-symbol-info' },

			{ id: 'tool-find-references', label: 'find_references', href: '/tools/find-references' },
			{ id: 'tool-find-overrides', label: 'find_overrides', href: '/tools/find-overrides' },
			{ id: 'tool-find-implementations', label: 'find_implementations', href: '/tools/find-implementations' },

			{ id: 'tool-get-type-info', label: 'get_type_info', href: '/tools/get-type-info' },
			{ id: 'tool-get-type-source', label: 'get_type_source', href: '/tools/get-type-source' },
			{ id: 'tool-get-method-signature', label: 'get_method_signature', href: '/tools/get-method-signature' },
			{ id: 'tool-get-method-source', label: 'get_method_source', href: '/tools/get-method-source' },

			{ id: 'tool-semantic-query', label: 'semantic_query', href: '/tools/semantic-query' },
			{ id: 'tool-search-text', label: 'search_text', href: '/tools/search-text' },

			{ id: 'tool-get-type-hierarchy', label: 'get_type_hierarchy', href: '/tools/get-type-hierarchy' },
			{ id: 'tool-get-derived-types', label: 'get_derived_types', href: '/tools/get-derived-types' },
			{ id: 'tool-find-member-in-hierarchy', label: 'find_member_in_hierarchy', href: '/tools/find-member-in-hierarchy' },

			{ id: 'tool-find-callers', label: 'find_callers', href: '/tools/find-callers' },
			{ id: 'tool-get-outgoing-calls', label: 'get_outgoing_calls', href: '/tools/get-outgoing-calls' },
			{ id: 'tool-analyze-change-impact', label: 'analyze_change_impact', href: '/tools/analyze-change-impact' },

			{ id: 'tool-rename-symbol', label: 'rename_symbol', href: '/tools/rename-symbol' },
			{ id: 'tool-move-type', label: 'move_type', href: '/tools/move-type' },
			{ id: 'tool-move-member', label: 'move_member', href: '/tools/move-member' },

			{ id: 'tool-get-code-fixes', label: 'get_code_fixes', href: '/tools/get-code-fixes' },
			{ id: 'tool-apply-code-fix', label: 'apply_code_fix', href: '/tools/apply-code-fix' },
			{ id: 'tool-organize-usings', label: 'organize_usings', href: '/tools/organize-usings' },
			{ id: 'tool-format-document', label: 'format_document', href: '/tools/format-document' },

			{ id: 'tool-view-external-definition', label: 'view_external_definition', href: '/tools/view-external-definition' },

			{ id: 'tool-get-type-dependencies', label: 'get_type_dependencies', href: '/tools/get-type-dependencies' },
			{ id: 'tool-analyze-complexity', label: 'analyze_complexity', href: '/tools/analyze-complexity' },

			{ id: 'tool-batch', label: 'batch', href: '/tools/batch' }
		]
	},
	{ id: 'playground', label: 'Playground', href: '/playground' },
	{ id: 'prompts', label: 'Prompts', href: '/prompts' },
	{ id: 'faq', label: 'FAQ', href: '/faq' },
	{ id: 'privacy', label: 'Privacy', href: '/privacy' },
	{ id: 'pricing', label: 'Pricing', href: '/pricing' }
];
