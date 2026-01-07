<script lang="ts">
	import Intro from '$components/pages/Intro.svelte';
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>Introduction - {content.meta.title}</title>
</svelte:head>

<Intro content={content.intro} />
