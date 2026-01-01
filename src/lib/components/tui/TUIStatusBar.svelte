<script lang="ts">
	interface StatusKey {
		key: string;
		label: string;
		action?: () => void;
	}

	interface Props {
		keys?: StatusKey[];
	}

	const defaultKeys: StatusKey[] = [
		{ key: 'F1', label: 'Help' },
		{ key: 'F2', label: 'Menu' },
		{ key: 'F3', label: 'View' },
		{ key: 'F9', label: 'Theme' },
		{ key: 'F10', label: 'Quit' },
		{ key: 'F12', label: 'Game' }
	];

	let { keys = defaultKeys }: Props = $props();
</script>

<footer class="tui-statusbar">
	<div class="statusbar-content">
		{#each keys as item}
			<button
				class="status-key"
				onclick={item.action}
				title="{item.key} - {item.label}"
			>
				<span class="key">{item.key}</span>
				<span class="label">{item.label}</span>
			</button>
		{/each}
	</div>
</footer>

<style>
	.tui-statusbar {
		display: flex;
		align-items: center;
		padding: var(--spacing-xs) var(--spacing-md);
		background-color: var(--status-bg);
		border-top: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		flex-shrink: 0;
		user-select: none;
	}

	.statusbar-content {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.status-key {
		display: flex;
		align-items: center;
		gap: 0;
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	.status-key:hover .key {
		background-color: var(--accent);
	}

	.status-key:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.key {
		background-color: var(--status-key-bg);
		color: var(--status-key-fg);
		padding: var(--spacing-xs) var(--spacing-sm);
		font-weight: 500;
	}

	.label {
		color: var(--status-fg);
		padding: var(--spacing-xs) var(--spacing-sm);
	}
</style>
