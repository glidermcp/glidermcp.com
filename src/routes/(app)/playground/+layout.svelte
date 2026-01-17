<script lang="ts">
	import { PlaygroundView } from '$components/playground';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<section class="playground-page">
	<p class="playground-mobile-message">Playground is available on desktop.</p>
	<div class="playground-desktop">
		<PlaygroundView />
	</div>
</section>

{@render children()}

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
