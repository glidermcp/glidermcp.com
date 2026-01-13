<script lang="ts">
	import { highlightToHtml, resolveLanguage } from '$lib/utils/highlight';

	interface Props {
		code: string;
		language?: string;
		showLineNumbers?: boolean;
		title?: string;
	}

	let { code, language = 'bash', showLineNumbers = false, title }: Props = $props();

	let copied = $state(false);
	const resolvedLanguage = $derived(resolveLanguage(language));
	const highlightedHtml = $derived(highlightToHtml(code, resolvedLanguage));

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
			<pre class="highlighted"><code class={`language-${resolvedLanguage}`}>{@html highlightedHtml}</code></pre>
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

	.highlighted {
		margin: 0;
		padding: 0;
		background: transparent;
		overflow: visible;
		white-space: pre;
	}

	.highlighted code {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	/* Minimal syntax highlighting theme driven by CSS variables (set per site theme) */
	.highlighted :global(.token.comment) {
		color: var(--syntax-comment);
	}

	.highlighted :global(.token.keyword) {
		color: var(--syntax-keyword);
	}

	.highlighted :global(.token.string) {
		color: var(--syntax-string);
	}

	.highlighted :global(.token.number) {
		color: var(--syntax-number);
	}

	.highlighted :global(.token.boolean),
	.highlighted :global(.token.null) {
		color: var(--syntax-constant);
	}

	.highlighted :global(.token.function) {
		color: var(--syntax-function);
	}

	.highlighted :global(.token.class-name),
	.highlighted :global(.token.type) {
		color: var(--syntax-type);
	}

	.highlighted :global(.token.property) {
		color: var(--syntax-property);
	}

	.highlighted :global(.token.operator) {
		color: var(--syntax-operator);
	}

	.highlighted :global(.token.punctuation) {
		color: var(--syntax-punctuation);
	}

	.highlighted :global(.token.variable) {
		color: var(--syntax-variable);
	}
</style>
