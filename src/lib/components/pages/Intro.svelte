<script lang="ts">
	import Logo from '$components/tui/Logo.svelte';
	import { CodeBlock } from '$components/docs';
	import type { IntroContent } from '$lib/content/types';

	interface Props {
		content: IntroContent;
	}

	let { content }: Props = $props();
</script>

<div class="intro-content">
	<Logo size="large" />

	<h2>{content.title}</h2>
	<p class="tagline">{content.tagline}</p>

	{#each content.paragraphs as paragraph}
		<p>{@html paragraph}</p>
	{/each}

	<h3>{content.featuresTitle}</h3>
	<ul class="feature-list">
		{#each content.features as feature}
			<li>{feature}</li>
		{/each}
	</ul>

	<h3>{content.quickInstallTitle}</h3>
	<CodeBlock code={content.quickInstall.code} language={content.quickInstall.language} />

	<p class="hint">{@html content.hint}</p>
</div>

<style>
	.intro-content {
		max-width: 650px;
	}

	.tagline {
		color: var(--accent);
		font-size: var(--font-size-base);
		margin-bottom: var(--spacing-lg);
	}
</style>
