<script lang="ts">
	import ToolsList from '$components/pages/ToolsList.svelte';
	import { getContent } from '$lib/content';

	let expandedTools = $state<Set<string>>(new Set());

	const content = getContent('en');

	function handleToggle(toolId: string) {
		const newSet = new Set(expandedTools);
		if (newSet.has(toolId)) {
			newSet.delete(toolId);
		} else {
			newSet.add(toolId);
		}
		expandedTools = newSet;
	}
</script>

<svelte:head>
	<title>Tools - {content.meta.title}</title>
</svelte:head>

<ToolsList content={content.toolsList} {expandedTools} onToggle={handleToggle} />
