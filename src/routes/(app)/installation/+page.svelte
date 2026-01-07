<script lang="ts">
	import InstallationOverview from '$components/pages/InstallationOverview.svelte';
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>Installation - {content.meta.title}</title>
</svelte:head>

<InstallationOverview content={content.installation} />
