<script lang="ts">
	import { theme, toggleTheme } from '$stores/theme';
	import { mobileNavOpen, toggleMobileNav } from '$stores/keyboard';

	interface Props {
		title?: string;
	}

	let { title = 'Glider MCP' }: Props = $props();

	const currentTheme = $derived($theme);
	const themeName = $derived(currentTheme === 'ncurses-dark' ? 'Dark' : 'Light');
	const isMobileNavOpen = $derived($mobileNavOpen);
</script>

<header class="tui-menubar">
	<div class="menubar-left">
		<button
			class="hamburger-button"
			aria-label="Toggle navigation"
			aria-expanded={isMobileNavOpen}
			onclick={toggleMobileNav}
		>
			≡
		</button>
		<span class="logo">✈</span>
		<span class="title">{title}</span>
	</div>
	<div class="menubar-right">
		<button
			class="theme-indicator"
			onclick={toggleTheme}
			title="Toggle theme"
			aria-label="Toggle theme"
		>
			[{themeName}]
		</button>
		<button class="theme-toggle" onclick={toggleTheme} title="F9 to toggle theme">
			F9 Theme
		</button>
	</div>
</header>

<style>
	.tui-menubar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--menu-bg);
		color: var(--menu-fg);
		border-bottom: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		flex-shrink: 0;
		user-select: none;
	}

	.menubar-left {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.hamburger-button {
		display: none;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		background: transparent;
		border: 1px solid var(--border);
		color: var(--menu-fg);
		font-size: var(--font-size-lg);
		cursor: pointer;
		padding: 0;
	}

	.logo {
		font-size: var(--font-size-lg);
	}

	.title {
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	.menubar-right {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.theme-indicator {
		background: transparent;
		border: 1px solid transparent;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		font-family: var(--font-mono);
		cursor: pointer;
		padding: var(--spacing-xs) var(--spacing-sm);
	}

	.theme-indicator:hover {
		color: var(--menu-fg);
		border-color: var(--border);
	}

	.theme-indicator:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.theme-toggle {
		background-color: var(--status-key-bg);
		color: var(--status-key-fg);
		border: none;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		cursor: pointer;
		transition: background-color 0.1s;
	}

	.theme-toggle:hover {
		background-color: var(--accent);
		color: var(--bg-primary);
	}

	.theme-toggle:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.tui-menubar {
			padding: var(--spacing-xs) var(--spacing-sm);
		}

		.menubar-left,
		.menubar-right {
			gap: var(--spacing-sm);
		}

		.hamburger-button {
			display: inline-flex;
		}

		.theme-toggle {
			display: none;
		}
	}
</style>
