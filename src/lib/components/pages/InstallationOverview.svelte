<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { InstallationContent } from '$lib/content/types';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { focusedPanel } from '$stores/keyboard';

	interface Props {
		content: InstallationContent;
		onSelect: (id: string) => void;
	}

	let { content, onSelect }: Props = $props();

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
					onSelect(client.id);
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
		onSelect(content.clients[index].id);
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
		<button
			class="client-card"
			class:selected={index === selectedIndex}
			role="gridcell"
			aria-selected={index === selectedIndex}
			tabindex={index === selectedIndex ? 0 : -1}
			onclick={() => handleCardClick(index)}
		>
			<span class="client-name">{client.name}</span>
			<span class="client-desc">{client.desc}</span>
		</button>
	{/each}
</div>
