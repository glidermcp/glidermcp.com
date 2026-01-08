<script lang="ts">
	import type { PrivacyContent } from '$lib/content/types';

	interface Props {
		content: PrivacyContent;
	}

	let { content }: Props = $props();
</script>

<h2>{content.title}</h2>

{#each content.intro as paragraph}
	<p>{paragraph}</p>
{/each}

{#each content.sections as section}
	<h3>{section.title}</h3>
	{#if section.paragraphs}
		{#each section.paragraphs as paragraph}
			<p>{paragraph}</p>
		{/each}
	{/if}
	{#if section.list}
		<ul class="feature-list">
			{#each section.list as item}
				<li>{item}</li>
			{/each}
		</ul>
	{/if}
{/each}
