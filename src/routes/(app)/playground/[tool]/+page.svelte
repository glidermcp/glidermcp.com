<script lang="ts">
	import { page } from '$app/stores';
	import { getContent } from '$lib/content';

	const content = getContent('en');
	const toolSlug = $derived($page.params.tool);
</script>

<svelte:head>
	<title>Playground - {toolSlug?.replace(/-/g, '_')} - {content.meta.title}</title>
</svelte:head>

