<script lang="ts">
	import Privacy from '$components/pages/Privacy.svelte';
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>Privacy - {content.meta.title}</title>
</svelte:head>

<Privacy content={content.privacy} />
