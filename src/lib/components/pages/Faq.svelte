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
