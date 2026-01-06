<script lang="ts">
	import { CodeBlock } from '$components/docs';
	import type { QuickStartContent } from '$lib/content/types';

	interface Props {
		content: QuickStartContent;
	}

	let { content }: Props = $props();
</script>

<h2>{content.title}</h2>
<p>{content.intro}</p>

{#each content.sections as section}
	<h3>{section.title}</h3>
	{#if section.paragraphs}
		{#each section.paragraphs as paragraph}
			<p>{@html paragraph}</p>
		{/each}
	{/if}
	{#if section.list}
		<ul class="feature-list">
			{#each section.list as item}
				<li>{item}</li>
			{/each}
		</ul>
	{/if}
	{#if section.code}
		<CodeBlock code={section.code.code} language={section.code.language} />
	{/if}
{/each}
