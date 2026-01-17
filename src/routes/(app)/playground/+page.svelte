<script lang="ts">
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>Playground - {content.meta.title}</title>
</svelte:head>
