<script lang="ts">
	import CodeBlock from './CodeBlock.svelte';

	interface InstallStep {
		title: string;
		description?: string;
		code?: string;
		language?: string;
	}

	interface Props {
		client: string;
		icon?: string;
		steps: InstallStep[];
	}

	let { client, icon, steps }: Props = $props();
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
			<div class="step">
				<div class="step-header">
					<span class="step-number">{i + 1}.</span>
					<span class="step-title">{step.title}</span>
				</div>

				{#if step.description}
					<p class="step-description">{step.description}</p>
				{/if}

				{#if step.code}
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

	.step-header {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xs);
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
</style>
