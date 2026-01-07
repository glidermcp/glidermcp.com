<script lang="ts">
	import Pricing from '$components/pages/Pricing.svelte';
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>Pricing - {content.meta.title}</title>
</svelte:head>

<Pricing content={content.pricing} />
