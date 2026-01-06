<script lang="ts">
	import type { InstallationContent } from '$lib/content/types';

	interface Props {
		content: InstallationContent;
		onSelect: (id: string) => void;
	}

	let { content, onSelect }: Props = $props();
</script>

<h2>{content.title}</h2>
{#each content.intro as paragraph}
	<p>{@html paragraph}</p>
{/each}
<p class="hint">{content.hint}</p>

<div class="client-grid" role="listbox" aria-label={content.ariaLabel}>
	{#each content.clients as client, index}
		<button
			class="client-card"
			role="option"
			aria-selected={false}
			onclick={() => onSelect(client.id)}
			onkeydown={(e) => {
				const grid = e.currentTarget.parentElement;
				const buttons = grid?.querySelectorAll('.client-card');
				if (!buttons) return;

				let newIndex = index;
				if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
					newIndex = Math.min(buttons.length - 1, index + 1);
					e.preventDefault();
				} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
					newIndex = Math.max(0, index - 1);
					e.preventDefault();
				} else if (e.key === 'Home') {
					newIndex = 0;
					e.preventDefault();
				} else if (e.key === 'End') {
					newIndex = buttons.length - 1;
					e.preventDefault();
				}

				if (newIndex !== index) {
					(buttons[newIndex] as HTMLElement)?.focus();
				}
			}}
		>
			<span class="client-name">{client.name}</span>
			<span class="client-desc">{client.desc}</span>
		</button>
	{/each}
</div>
