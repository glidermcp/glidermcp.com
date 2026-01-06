<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme, applyTheme, type ThemeType } from '$stores/theme';
	import {
		initNetworkStatus,
		initInstallPrompt,
		initServiceWorker
	} from '$stores/network';
	import Toast from '$components/ui/Toast.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	// Apply theme on mount and when it changes
	onMount(() => {
		// Apply initial theme
		applyTheme($theme);

		// Subscribe to theme changes
		const unsubscribe = theme.subscribe((value: ThemeType) => {
			applyTheme(value);
		});

		// Initialize PWA features
		const cleanupNetwork = initNetworkStatus();
		const cleanupInstall = initInstallPrompt();
		const cleanupSW = initServiceWorker();

		return () => {
			unsubscribe();
			cleanupNetwork();
			cleanupInstall();
			cleanupSW();
		};
	});

	// Also handle SSR by applying theme in effect
	$effect(() => {
		applyTheme($theme);
	});
</script>

{@render children()}
<Toast />
