<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import type { InstallationContent } from '$lib/content/types';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { focusedPanel } from '$stores/keyboard';

	interface Props {
		content: InstallationContent;
	}

	let { content }: Props = $props();

	// Track selected card index for keyboard navigation
	let selectedIndex = $state(0);
	const isActive = $derived($focusedPanel === 'right');

	function handleKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		// Only handle when right panel is focused
		if (!isActive) return false;

		const totalItems = content.clients.length;
		if (totalItems === 0) return false;

		switch (action) {
			case 'left': {
				// Move left
				if (selectedIndex > 0) {
					selectedIndex = selectedIndex - 1;
					scrollToSelected();
				}
				return true;
			}

			case 'right': {
				// Move right
				if (selectedIndex < totalItems - 1) {
					selectedIndex = selectedIndex + 1;
					scrollToSelected();
				}
				return true;
			}

			case 'home':
				selectedIndex = 0;
				scrollToSelected();
				return true;

			case 'end':
				selectedIndex = totalItems - 1;
				scrollToSelected();
				return true;

			case 'select': {
				// Enter: Navigate to the selected client
				const client = content.clients[selectedIndex];
				if (client) {
					goto(client.href);
				}
				return true;
			}

			default:
				return false;
		}
	}

	function scrollToSelected(): void {
		requestAnimationFrame(() => {
			const selectedEl = document.querySelector('.client-card.selected');
			if (selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		});
	}

	function handleCardClick(index: number): void {
		selectedIndex = index;
		// Navigation will be handled by the anchor
	}

	// Register keyboard handler
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleKeyboard);
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<h2>{content.title}</h2>
{#each content.intro as paragraph}
	<p>{@html paragraph}</p>
{/each}
<p class="hint">{content.hint}</p>

<div
	class="client-grid"
	class:active={isActive}
	role="grid"
	aria-label={content.ariaLabel}
>
	{#each content.clients as client, index}
		<a
			href={client.href}
			class="client-card"
			class:selected={index === selectedIndex}
			role="gridcell"
			aria-selected={index === selectedIndex}
			tabindex={index === selectedIndex ? 0 : -1}
			onclick={() => handleCardClick(index)}
		>
			<span class="client-name">{client.name}</span>
			<span class="client-desc">{client.desc}</span>
		</a>
	{/each}
</div>

<style>
	.client-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--spacing-md);
		margin-top: var(--spacing-lg);
	}

	.client-card {
		display: flex;
		flex-direction: column;
		padding: var(--spacing-md);
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-dim);
		cursor: pointer;
		text-align: left;
		font-family: var(--font-mono);
		transition: border-color 0.15s;
		text-decoration: none;
	}

	.client-card:hover {
		border-color: var(--accent);
	}

	.client-card:focus {
		outline: none;
		border-color: var(--accent);
		background-color: var(--selection-bg);
	}

	.client-card:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.client-card.selected {
		border-color: var(--accent);
		background-color: var(--selection-bg);
	}

	.client-grid.active .client-card.selected {
		border-color: var(--accent);
		background-color: var(--selection-bg);
	}

	.client-grid.active .client-card.selected .client-name,
	.client-grid.active .client-card.selected .client-desc {
		color: var(--selection-fg);
	}

	.client-grid:not(.active) .client-card.selected {
		border-color: var(--border);
		background-color: var(--selection-bg-dim);
	}

	.client-name {
		color: var(--accent);
		font-weight: 600;
		margin-bottom: var(--spacing-xs);
	}

	.client-desc {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}
</style>
