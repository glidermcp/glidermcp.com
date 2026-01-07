<script lang="ts">
	import { page } from '$app/stores';
	import { getContent } from '$lib/content';
	import ToolDetail from '$components/pages/ToolDetail.svelte';

	const content = getContent('en');

	// Convert URL slug back to selectedId format (e.g., 'server-status' -> 'tool-server-status')
	const toolSlug = $derived($page.params.tool);
	const selectedId = $derived(`tool-${toolSlug}`);
</script>

<svelte:head>
	<title>{toolSlug?.replace(/-/g, '_')} - {content.meta.title}</title>
</svelte:head>

<ToolDetail {selectedId} content={content.toolDetail} />
