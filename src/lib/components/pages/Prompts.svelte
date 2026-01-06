<script lang="ts">
	import { PromptExample } from '$components/docs';
	import type { PromptsContent } from '$lib/content/types';

	interface Props {
		content: PromptsContent;
	}

	let { content }: Props = $props();
</script>

<h2>{content.title}</h2>
<p>{content.intro}</p>

{#each content.groups as group}
	<PromptExample title={group.title} description={group.description} prompts={group.prompts} />
{/each}
