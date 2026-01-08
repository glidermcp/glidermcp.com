<script lang="ts">
	import { getHighlighter, resolveLanguage } from '$lib/utils/shiki';

	interface Props {
		code: string;
		language?: string;
		showLineNumbers?: boolean;
		title?: string;
	}

	let { code, language = 'bash', showLineNumbers = false, title }: Props = $props();

	let copied = $state(false);
	let highlightedHtml = $state('');
	let shikiLoaded = $state(false);

	async function loadShiki() {
		try {
			const highlighter = await getHighlighter();
			const resolvedLanguage = resolveLanguage(language);

			highlightedHtml = highlighter.codeToHtml(code, {
				lang: resolvedLanguage,
				theme: 'github-dark'
			});
			shikiLoaded = true;
		} catch (e) {
			// Fallback to plain text
			console.warn('Shiki failed to load, using plain text:', e);
			shikiLoaded = false;
		}
	}

	$effect(() => {
		void loadShiki();
	});

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (e) {
			console.error('Failed to copy:', e);
		}
	}

	// Split code into lines for line numbers
	const lines = $derived(code.split('\n'));
</script>

<div class="code-block-wrapper">
	{#if title}
		<div class="code-header">
			<span class="code-title">{title}</span>
			<button class="copy-button" onclick={copyToClipboard} title="Copy to clipboard">
				{copied ? '[copied]' : '[copy]'}
			</button>
		</div>
	{:else}
		<button class="copy-button floating" onclick={copyToClipboard} title="Copy to clipboard">
			{copied ? '[copied]' : '[copy]'}
		</button>
	{/if}

	<div class="code-container">
		{#if showLineNumbers}
			<div class="line-numbers">
				{#each lines as _, i}
					<span class="line-number">{i + 1}</span>
				{/each}
			</div>
		{/if}

		<div class="code-content">
			{#if shikiLoaded && highlightedHtml}
				{@html highlightedHtml}
			{:else}
				<pre class="fallback-code"><code>{code}</code></pre>
			{/if}
		</div>
	</div>
</div>

<style>
	.code-block-wrapper {
		position: relative;
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-dim);
		margin: var(--spacing-sm) 0 var(--spacing-md) 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-xs) var(--spacing-sm);
		background-color: var(--bg-primary);
		border-bottom: 1px solid var(--border-dim);
	}

	.code-title {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.copy-button {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		padding: var(--spacing-xs);
		transition: color 0.15s;
	}

	.copy-button:hover {
		color: var(--accent);
	}

	.copy-button.floating {
		position: absolute;
		top: var(--spacing-xs);
		right: var(--spacing-xs);
		z-index: 1;
	}

	.code-container {
		display: flex;
		overflow-x: auto;
	}

	.line-numbers {
		display: flex;
		flex-direction: column;
		padding: var(--spacing-sm);
		padding-right: var(--spacing-md);
		background-color: var(--bg-primary);
		border-right: 1px solid var(--border-dim);
		user-select: none;
	}

	.line-number {
		color: var(--text-muted);
		text-align: right;
		line-height: 1.5;
	}

	.code-content {
		flex: 1;
		padding: var(--spacing-sm);
		overflow-x: auto;
	}

	.code-content :global(pre) {
		margin: 0;
		padding: 0;
		background: transparent !important;
		overflow: visible;
	}

	.code-content :global(code) {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	.fallback-code {
		margin: 0;
		padding: 0;
		color: var(--text-primary);
		white-space: pre-wrap;
		word-break: break-word;
	}

	.fallback-code code {
		font-family: var(--font-mono);
	}
</style>
