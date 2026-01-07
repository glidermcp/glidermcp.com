<script lang="ts">
	import { CodeBlock } from '$components/docs';
	import type { PricingContent } from '$lib/content/types';

	interface Props {
		content: PricingContent;
	}

	let { content }: Props = $props();

	// Assemble email from parts to obfuscate from bots
	const emailParts = ['bogdan', 'sacrorum.com'];
	const email = emailParts.join('@');
	const mailto = `mailto:${email}`;
</script>

<h2>{content.title}</h2>

<div class="pricing-card">
	<h3>{content.planName}</h3>
	<p class="price">{content.price}</p>
	<ul class="feature-list">
		{#each content.features as feature}
			<li>{feature}</li>
		{/each}
	</ul>
</div>

<h3>{content.versionPolicyTitle}</h3>
{#each content.versionPolicy as paragraph}
	<p>{paragraph}</p>
{/each}
<CodeBlock code={content.updateCode.code} language={content.updateCode.language} />

<h3>{content.authorTitle}</h3>
<p>{content.authorLabel} <a href={content.authorUrl} class="link">{content.authorName}</a></p>
<p class="muted"><a href={mailto} class="link">{email}</a></p>

<h3>{content.licenseTitle}</h3>
<p>{content.licenseText}</p>

<style>
	.pricing-card {
		background-color: var(--bg-secondary);
		border: 1px solid var(--accent);
		padding: var(--spacing-lg);
		margin: var(--spacing-lg) 0;
		max-width: 300px;
	}

	.pricing-card :global(h3) {
		margin: 0 0 var(--spacing-sm) 0;
		color: var(--accent);
	}

	.price {
		font-size: 2rem;
		color: var(--text-primary);
		font-weight: 700;
		margin: 0 0 var(--spacing-md) 0;
	}
</style>
