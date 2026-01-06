<script lang="ts">
	import { CodeBlock } from '$components/docs';
	import type { PricingContent } from '$lib/content/types';

	interface Props {
		content: PricingContent;
	}

	let { content }: Props = $props();
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
<p class="muted">{content.authorEmail}</p>

<h3>{content.licenseTitle}</h3>
<p>{content.licenseText}</p>
