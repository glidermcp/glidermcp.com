<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
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
	const isAnalyticsEnabled = !dev && !import.meta.env.VITE_DISABLE_GA;

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

<svelte:head>
	{#if isAnalyticsEnabled}
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-MQP7KFQ9YD"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'G-MQP7KFQ9YD');
		</script>
	{/if}
</svelte:head>

{@render children()}
<Toast />
