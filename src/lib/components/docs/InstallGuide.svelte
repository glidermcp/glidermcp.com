<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import CodeBlock from './CodeBlock.svelte';
	import CodeTabs from './CodeTabs.svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { focusedPanel } from '$stores/keyboard';
	import type { InstallStep } from '$lib/content/types';

	interface Props {
		client: string;
		icon?: string;
		steps: InstallStep[];
	}

	let { client, icon, steps }: Props = $props();

	const isActive = $derived($focusedPanel === 'right');
	let selectedIndex = $state(0);
	let variantIndexByStep = $state<number[]>([]);

	$effect(() => {
		const len = steps.length;
		if (len === 0) {
			selectedIndex = 0;
			variantIndexByStep = [];
			return;
		}

		if (selectedIndex >= len) selectedIndex = len - 1;

		if (variantIndexByStep.length !== len) {
			variantIndexByStep = Array.from({ length: len }, (_, i) => variantIndexByStep[i] ?? 0);
		}
	});

	function setVariantIndex(stepIndex: number, nextIndex: number): void {
		variantIndexByStep[stepIndex] = nextIndex;
		variantIndexByStep = variantIndexByStep;
	}

	function selectStep(stepIndex: number): void {
		selectedIndex = stepIndex;
		scrollToSelected();
	}

	function getSelectedCode(): string | null {
		const step = steps[selectedIndex];
		if (!step) return null;
		if (step.codeVariants?.length) {
			const idx = variantIndexByStep[selectedIndex] ?? 0;
			return step.codeVariants[idx]?.code ?? step.codeVariants[0]?.code ?? null;
		}
		return step.code ?? null;
	}

	function copySelected(): boolean {
		const selection = typeof window !== 'undefined' ? window.getSelection() : null;
		if (selection && !selection.isCollapsed) return false;

		const code = getSelectedCode();
		if (!code) return false;

		// Prefer triggering the existing CodeBlock copy button so the UI flips to [copied].
		// This also ensures we use the same clipboard code path as a normal click.
		if (typeof document !== 'undefined') {
			const button = document.querySelector<HTMLButtonElement>('.install-guide .step.selected .copy-button');
			if (button) {
				button.click();
				return true;
			}
		}

		// Fallback to Clipboard API if no CodeBlock button is found (should be rare).
		if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
			try {
				void navigator.clipboard.writeText(code);
				return true;
			} catch {
				return false;
			}
		}

		return false;
	}

	function handleKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		if (!isActive) return false;
		if (steps.length === 0) return false;

		switch (action) {
			case 'up':
				if (selectedIndex > 0) selectStep(selectedIndex - 1);
				return true;

			case 'down':
				if (selectedIndex < steps.length - 1) selectStep(selectedIndex + 1);
				return true;

			case 'home':
				selectStep(0);
				return true;

			case 'end':
				selectStep(steps.length - 1);
				return true;

			case 'left': {
				const variants = steps[selectedIndex]?.codeVariants;
				if (!variants?.length) return false;
				const cur = variantIndexByStep[selectedIndex] ?? 0;
				const next = (cur - 1 + variants.length) % variants.length;
				setVariantIndex(selectedIndex, next);
				return true;
			}

			case 'right': {
				const variants = steps[selectedIndex]?.codeVariants;
				if (!variants?.length) return false;
				const cur = variantIndexByStep[selectedIndex] ?? 0;
				const next = (cur + 1) % variants.length;
				setVariantIndex(selectedIndex, next);
				return true;
			}

			case 'tab': {
				const variants = steps[selectedIndex]?.codeVariants;
				if (!variants?.length) return false;
				const cur = variantIndexByStep[selectedIndex] ?? 0;
				const delta = event.shiftKey ? -1 : 1;
				const next = (cur + delta + variants.length) % variants.length;
				setVariantIndex(selectedIndex, next);
				return true;
			}

			case 'select':
			case 'toggle':
				// On this page, Enter/Space should not trigger clicks/toggles.
				return true;

			case 'copy':
				if (!getSelectedCode()) return false;
				return copySelected();

			default:
				return false;
		}
	}

	function scrollToSelected(): void {
		requestAnimationFrame(() => {
			const selectedEl = document.querySelector('.install-guide .step.selected');
			selectedEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		});
	}

	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleKeyboard);
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="install-guide">
	<div class="guide-header">
		{#if icon}
			<span class="guide-icon">{icon}</span>
		{/if}
		<h3>{client}</h3>
	</div>

	<div class="steps">
		{#each steps as step, i}
			<div class="step" class:selected={i === selectedIndex} class:active={isActive}>
				<div class="step-header">
					<button type="button" class="step-select" onclick={() => selectStep(i)}>
						<span class="step-number">{i + 1}.</span>
						<span class="step-title">
							{step.title}
						</span>
					</button>
				</div>

				{#if step.description}
					<div class="step-description">{@html step.description}</div>
				{/if}

				{#if step.codeVariants?.length}
					<CodeTabs
						variants={step.codeVariants}
						activeIndex={variantIndexByStep[i] ?? 0}
						onChange={(nextIndex) => setVariantIndex(i, nextIndex)}
						active={isActive && i === selectedIndex}
					/>
				{:else if step.code}
					<CodeBlock code={step.code} language={step.language || 'bash'} />
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.install-guide {
		border: 1px solid var(--border-dim);
		margin-bottom: var(--spacing-lg);
		background-color: var(--bg-secondary);
	}

	.guide-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--bg-primary);
		border-bottom: 1px solid var(--border-dim);
	}

	.guide-icon {
		font-size: var(--font-size-lg);
	}

	.guide-header h3 {
		margin: 0;
		color: var(--accent);
		font-size: var(--font-size-base);
		font-weight: 600;
	}

	.steps {
		padding: var(--spacing-md);
	}

	.step {
		margin-bottom: var(--spacing-lg);
	}

	.step:last-child {
		margin-bottom: 0;
	}

	.step.selected {
		outline: 1px solid var(--border);
		outline-offset: 4px;
	}

	.step.active.selected {
		outline-color: var(--accent);
	}

	.step-header {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xs);
	}

	.step-select {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-sm);
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		font-family: var(--font-mono);
		text-align: left;
	}

	.step-select:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.step-number {
		color: var(--text-muted);
		font-family: var(--font-mono);
	}

	.step-title {
		color: var(--text-primary);
		font-weight: 500;
	}

	.step-description {
		color: var(--text-secondary);
		margin: var(--spacing-xs) 0;
		padding-left: calc(var(--spacing-sm) + 1.5ch);
		line-height: 1.5;
	}

	.step-description :global(a) {
		color: var(--accent);
		text-decoration: none;
	}

	.step-description :global(a:hover) {
		text-decoration: underline;
	}

	.step-description :global(p) {
		margin: 0;
	}

	.step-description :global(ul) {
		margin: var(--spacing-xs) 0;
		padding-left: 1.5em;
	}

	.step-description :global(li) {
		margin: 0;
	}

	@media (max-width: 768px) {
		.step-select {
			padding: 10px 0;
			min-height: 44px;
			font-size: var(--font-size-lg);
		}
	}
</style>
