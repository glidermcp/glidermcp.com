<script lang="ts">
	import type { FaqContent } from '$lib/content/types';

	interface Props {
		content: FaqContent;
	}

	let { content }: Props = $props();
</script>

<h2>{content.title}</h2>

{#each content.items as item}
	<div class="faq-item">
		<h3>{item.question}</h3>
		{#each item.answer as paragraph}
			<p>{@html paragraph}</p>
		{/each}
	</div>
{/each}

<style>
	.faq-item {
		margin-bottom: var(--spacing-lg);
		padding-bottom: var(--spacing-lg);
		border-bottom: 1px solid var(--border-dim);
	}

	.faq-item:last-child {
		border-bottom: none;
	}

	.faq-item :global(h3) {
		color: var(--text-primary);
		margin-top: 0;
	}

	.faq-item :global(code) {
		background-color: var(--bg-secondary);
		padding: 2px var(--spacing-xs);
		color: var(--accent);
	}
</style>
