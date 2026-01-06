<script lang="ts">
	interface Props {
		title: string;
		prompts: string[];
		description?: string;
	}

	let { title, prompts, description }: Props = $props();
</script>

<div class="prompt-example">
	<div class="prompt-header">
		<h4>{title}</h4>
		{#if description}
			<p class="prompt-description">{description}</p>
		{/if}
	</div>

	<div class="prompts">
		{#each prompts as prompt}
			<div class="prompt-item">
				<span class="prompt-prefix">&gt;</span>
				<span class="prompt-text">{prompt}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.prompt-example {
		border: 1px solid var(--border-dim);
		margin-bottom: var(--spacing-md);
		background-color: var(--bg-secondary);
	}

	.prompt-header {
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--bg-primary);
		border-bottom: 1px solid var(--border-dim);
	}

	.prompt-header h4 {
		margin: 0;
		color: var(--accent);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.prompt-description {
		margin: var(--spacing-xs) 0 0 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.prompts {
		padding: var(--spacing-md);
	}

	.prompt-item {
		display: flex;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	.prompt-item:last-child {
		margin-bottom: 0;
	}

	.prompt-prefix {
		color: var(--accent);
		user-select: none;
	}

	.prompt-text {
		color: var(--text-primary);
	}
</style>
