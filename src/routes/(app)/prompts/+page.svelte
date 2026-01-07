<script lang="ts">
	import Prompts from '$components/pages/Prompts.svelte';
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>Prompts - {content.meta.title}</title>
</svelte:head>

<Prompts content={content.prompts} />
