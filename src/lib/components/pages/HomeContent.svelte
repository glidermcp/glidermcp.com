<script lang="ts">
	import { PlaygroundView } from '$components/playground';
	import type { HomeContent } from '$lib/content';
	import Intro from './Intro.svelte';
	import QuickStart from './QuickStart.svelte';
	import InstallationOverview from './InstallationOverview.svelte';
	import InstallationGuidePage from './InstallationGuidePage.svelte';
	import InstallationOther from './InstallationOther.svelte';
	import ToolsList from './ToolsList.svelte';
	import ToolDetail from './ToolDetail.svelte';
	import Prompts from './Prompts.svelte';
	import Faq from './Faq.svelte';
	import Pricing from './Pricing.svelte';

	interface Props {
		selectedId: string;
		content: HomeContent;
		expandedTools: Set<string>;
		onSelect: (id: string) => void;
		onToggleTool: (toolId: string) => void;
	}

	let { selectedId, content, expandedTools, onSelect, onToggleTool }: Props = $props();
</script>

{#if selectedId === 'intro'}
	<Intro content={content.intro} />
{:else if selectedId === 'quick-start'}
	<QuickStart content={content.quickStart} />
{:else if selectedId === 'installation'}
	<InstallationOverview content={content.installation} onSelect={onSelect} />
{:else if selectedId.startsWith('install-')}
	{#if selectedId === content.installationOther.id}
		<InstallationOther content={content.installationOther} />
	{:else}
		{@const guide = content.installationGuides[selectedId]}
		{#if guide}
			<InstallationGuidePage {guide} />
		{:else}
			<p class="muted">{content.installation.notFoundText}</p>
		{/if}
	{/if}
{:else if selectedId === 'tools'}
	<ToolsList content={content.toolsList} expandedTools={expandedTools} onToggle={onToggleTool} />
{:else if selectedId.startsWith('tool-')}
	<ToolDetail {selectedId} content={content.toolDetail} />
{:else if selectedId === 'playground'}
	<PlaygroundView />
{:else if selectedId === 'prompts'}
	<Prompts content={content.prompts} />
{:else if selectedId === 'faq'}
	<Faq content={content.faq} />
{:else if selectedId === 'pricing'}
	<Pricing content={content.pricing} />
{/if}
