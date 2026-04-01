<script lang="ts">
	import InstallGuide from '$components/docs/InstallGuide.svelte';
	import type { InstallationGuide } from '$lib/content/types';

	interface Props {
		guide: InstallationGuide;
	}

	let { guide }: Props = $props();
</script>

<h2>{guide.title}</h2>
<p>{guide.subtitle}</p>

<InstallGuide client={guide.cardTitle} steps={guide.steps} />
