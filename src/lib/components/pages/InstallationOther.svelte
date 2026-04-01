<script lang="ts">
	import { CodeBlock } from '$components/docs';
	import CodeTabs from '$components/docs/CodeTabs.svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { setStatusBarKeys } from '$stores/statusbar';
	import { focusedPanel, setFocusedPanel } from '$stores/keyboard';
	import type { OtherInstallContent } from '$lib/content/types';
	import type { StatusKey } from '$types/statusbar';

	interface Props {
		content: OtherInstallContent;
	}

	let { content }: Props = $props();

	let activeIndexBySection = $state<number[]>([]);
	const isActive = $derived($focusedPanel === 'right');
	const variantSectionIndexes = $derived.by(() => {
		return content.sections.flatMap((section, sectionIndex) => {
			return (section.codeVariants?.length ?? 0) > 1 ? [sectionIndex] : [];
		});
	});
	const statusKeys = $derived.by((): StatusKey[] | null => {
		if (!isActive) return null;

		const keys: StatusKey[] = [
			{ key: keyboardManager.getKeyDisplay('theme'), label: 'Theme', action: 'theme' }
		];

		if (variantSectionIndexes.length > 0) {
			keys.push(
				{ key: keyboardManager.getKeyDisplay('tab'), label: 'OS', action: 'tab', handler: () => { shiftAllVariantSections(1); } },
				{ key: '←/→', label: 'OS', action: 'left', handler: () => { shiftAllVariantSections(1); } }
			);
		}

		keys.push(
			{ key: keyboardManager.getKeyDisplay('back'), label: 'Back', action: 'back', handler: () => { setFocusedPanel('left'); } },
			{ key: keyboardManager.getKeyDisplay('game'), label: 'Game', action: 'game' }
		);

		return keys;
	});

	$effect(() => {
		activeIndexBySection = Array.from({ length: content.sections.length }, () => 0);
	});

	function setActiveIndex(sectionIndex: number, nextIndex: number): void {
		activeIndexBySection[sectionIndex] = nextIndex;
		activeIndexBySection = activeIndexBySection;
	}

	function shiftAllVariantSections(delta: number): boolean {
		if (variantSectionIndexes.length === 0) return false;

		const nextIndexes = [...activeIndexBySection];
		let changed = false;

		for (const sectionIndex of variantSectionIndexes) {
			const variants = content.sections[sectionIndex]?.codeVariants;
			if (!variants || variants.length < 2) continue;

			const currentIndex = nextIndexes[sectionIndex] ?? 0;
			const nextIndex = (currentIndex + delta + variants.length) % variants.length;
			if (nextIndex !== currentIndex) {
				nextIndexes[sectionIndex] = nextIndex;
				changed = true;
			}
		}

		if (!changed) return false;

		activeIndexBySection = nextIndexes;
		return true;
	}

	function handleKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		if (!isActive) return false;

		switch (action) {
			case 'left':
				return shiftAllVariantSections(-1);

			case 'right':
				return shiftAllVariantSections(1);

			case 'tab':
				return shiftAllVariantSections(event.shiftKey ? -1 : 1);

			default:
				return false;
		}
	}

	$effect(() => {
		return keyboardManager.addHandler(handleKeyboard);
	});

	$effect(() => {
		setStatusBarKeys(statusKeys);
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
