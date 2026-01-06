<script lang="ts">
	import { CodeBlock } from '$components/docs';
	import type { OtherInstallContent } from '$lib/content/types';

	interface Props {
		content: OtherInstallContent;
	}

	let { content }: Props = $props();
</script>

<h2>{content.title}</h2>
<p>{content.subtitle}</p>

{#each content.sections as section}
	<h3>{section.title}</h3>
	{#if section.description}
		<p>{@html section.description}</p>
	{/if}
	{#if section.code}
		<CodeBlock code={section.code.code} language={section.code.language} />
	{/if}
{/each}
