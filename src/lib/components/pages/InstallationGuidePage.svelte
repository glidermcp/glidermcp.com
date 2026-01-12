<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import InstallGuide from '$components/docs/InstallGuide.svelte';
	import type { InstallationGuide } from '$lib/content/types';
	import { setStatusBarKeys } from '$stores/statusbar';
	import type { StatusKey } from '$types/statusbar';

	interface Props {
		guide: InstallationGuide;
	}

	let { guide }: Props = $props();

	const installKeys: StatusKey[] = [
		{ key: 'F9', label: 'Theme', action: 'theme' },
		{ key: 'Tab', label: 'OS', action: 'tab' },
		{ key: '↑/↓', label: 'Step', action: 'up' },
		{ key: '←/→', label: 'OS', action: 'left' },
		{ key: '^C', label: 'Copy', action: 'copy' },
		{ key: 'Esc', label: 'Back', action: 'back' },
		{ key: '^G', label: 'Game', action: 'game' }
	];

	onMount(() => {
		setStatusBarKeys(installKeys);
	});

	onDestroy(() => {
		setStatusBarKeys(null);
	});
</script>

<h2>{guide.title}</h2>
<p>{guide.subtitle}</p>

<InstallGuide client={guide.cardTitle} steps={guide.steps} />
