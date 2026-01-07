<script lang="ts">
	import Faq from '$components/pages/Faq.svelte';
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>FAQ - {content.meta.title}</title>
</svelte:head>

<Faq content={content.faq} />
