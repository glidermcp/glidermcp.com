<script lang="ts">
	import { page } from '$app/stores';
	import { getContent } from '$lib/content';
	import InstallationGuidePage from '$components/pages/InstallationGuidePage.svelte';
	import InstallationOther from '$components/pages/InstallationOther.svelte';

	const content = getContent('en');

	// Map URL slugs to installation guide IDs
	const slugToId: Record<string, string> = {
		'claude-code': 'install-claude-code',
		'codex': 'install-codex',
		'gemini': 'install-gemini',
		'cursor': 'install-cursor',
		'copilot': 'install-copilot',
		'other': 'install-other'
	};

	const clientSlug = $derived($page.params.client ?? '');
	const guideId = $derived(clientSlug ? slugToId[clientSlug] : undefined);
	const guide = $derived(guideId ? content.installationGuides[guideId] : undefined);
	const isOther = $derived(clientSlug === 'other');
</script>

<svelte:head>
	{#if isOther}
		<title>{content.installationOther.title} - {content.meta.title}</title>
	{:else if guide}
		<title>{guide.title} - {content.meta.title}</title>
	{:else}
		<title>Installation - {content.meta.title}</title>
	{/if}
</svelte:head>

{#if isOther}
	<InstallationOther content={content.installationOther} />
{:else if guide}
	<InstallationGuidePage {guide} />
{:else}
	<h2>Not Found</h2>
	<p class="muted">{content.installation.notFoundText}</p>
{/if}
