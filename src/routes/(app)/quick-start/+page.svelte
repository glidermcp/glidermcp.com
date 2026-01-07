<script lang="ts">
	import QuickStart from '$components/pages/QuickStart.svelte';
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>Quick Start - {content.meta.title}</title>
</svelte:head>

<QuickStart content={content.quickStart} />
