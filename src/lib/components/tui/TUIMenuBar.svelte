<script lang="ts">
	import { theme, toggleTheme, isDarkTheme } from '$stores/theme';

	interface Props {
		title?: string;
	}

	let { title = 'Glider MCP' }: Props = $props();

	const currentTheme = $derived($theme);
	const themeName = $derived(currentTheme === 'ncurses-dark' ? 'Dark' : 'Light');
</script>

<header class="tui-menubar">
	<div class="menubar-left">
		<span class="logo">✈</span>
		<span class="title">{title}</span>
	</div>
	<div class="menubar-right">
		<span class="theme-indicator">[{themeName}]</span>
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
		color: var(--text-muted);
		font-size: var(--font-size-sm);
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
</style>
