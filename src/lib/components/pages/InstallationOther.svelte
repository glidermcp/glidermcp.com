<script lang="ts">
	import { CodeBlock } from '$components/docs';
	import CodeTabs from '$components/docs/CodeTabs.svelte';
	import { setStatusBarKeys } from '$stores/statusbar';
	import type { OtherInstallContent } from '$lib/content/types';
	import type { StatusKey } from '$types/statusbar';

	interface Props {
		content: OtherInstallContent;
	}

	let { content }: Props = $props();

	let activeIndexBySection = $state<number[]>([]);

	$effect(() => {
		activeIndexBySection = Array.from({ length: content.sections.length }, () => 0);
	});

	function setActiveIndex(sectionIndex: number, nextIndex: number): void {
		activeIndexBySection[sectionIndex] = nextIndex;
		activeIndexBySection = activeIndexBySection;
	}

	const installKeys: StatusKey[] = [
		{ key: 'F9', label: 'Theme', action: 'theme' },
		{ key: 'Tab', label: 'OS', action: 'tab' },
		{ key: '←/→', label: 'OS', action: 'left' },
		{ key: '^G', label: 'Game', action: 'game' }
	];

	$effect(() => {
		setStatusBarKeys(installKeys);
		return () => {
			setStatusBarKeys(null);
		};
	});
</script>

<h2>{content.title}</h2>
<p>{content.subtitle}</p>

{#each content.sections as section, sectionIndex}
	<h3>{section.title}</h3>
	{#if section.description}
		<p>{@html section.description}</p>
	{/if}
	{#if section.codeVariants?.length}
		<CodeTabs
			variants={section.codeVariants}
			activeIndex={activeIndexBySection[sectionIndex] ?? 0}
			onChange={(nextIndex) => setActiveIndex(sectionIndex, nextIndex)}
		/>
	{:else if section.code}
		<CodeBlock code={section.code.code} language={section.code.language} />
	{/if}
{/each}
