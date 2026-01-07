<script lang="ts">
	import { PlaygroundView } from '$components/playground';
	import { getContent } from '$lib/content';

	const content = getContent('en');
</script>

<svelte:head>
	<title>Playground - {content.meta.title}</title>
</svelte:head>

<section class="playground-page">
	<p class="playground-mobile-message">Playground is available on desktop.</p>
	<div class="playground-desktop">
		<PlaygroundView />
	</div>
</section>

<style>
	.playground-page {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}

	.playground-desktop {
		flex: 1;
		min-height: 0;
	}

	.playground-mobile-message {
		display: none;
		margin: 0;
		color: var(--text-secondary);
	}

	@media (max-width: 768px) {
		.playground-desktop {
			display: none;
		}

		.playground-mobile-message {
			display: block;
		}
	}
</style>
