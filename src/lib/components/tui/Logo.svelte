<script lang="ts">
	type LogoSize = 'small' | 'medium' | 'large';

	interface Props {
		size?: LogoSize;
		showText?: boolean;
	}

	let { size = 'medium', showText = true }: Props = $props();

	// ASCII art logos at different sizes
	const logoLarge = `   ____  _ _     _
  / ___|| (_) __| | ___ _ __
 | |  _ | | |/ _\` |/ _ \\ '__|
 | |_| || | | (_| |  __/ |
  \\____||_|_|\\__,_|\\___|_|`;

	const logoMedium = `  ___ _ _    _
 / __| (_)__| |___ _ _
| (_ | | / _\` / -_) '_|
 \\___|_|_\\__,_\\___|_|`;

	const logoSmall = `[Glider]`;

	const logos = {
		small: logoSmall,
		medium: logoMedium,
		large: logoLarge
	};

	// ASCII plane icon for menu bar
	const planeIcon = '>';

	const asciiLogo = $derived(logos[size]);
</script>

{#if size === 'small'}
	<span class="logo-inline">
		<span class="plane">{planeIcon}</span>
		{#if showText}
			<span class="text">Glider</span>
		{/if}
	</span>
{:else}
	<pre class="logo-ascii logo-{size}">{asciiLogo}</pre>
{/if}

<style>
	.logo-inline {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-family: var(--font-mono);
	}

	.plane {
		color: var(--accent);
		font-weight: bold;
		font-size: 1.2em;
	}

	.text {
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	.logo-ascii {
		font-family: var(--font-mono);
		color: var(--accent);
		line-height: 1.2;
		margin: 0;
		margin-bottom: var(--spacing-lg);
		white-space: pre;
	}

	.logo-large {
		font-size: var(--font-size-sm);
	}

	.logo-medium {
		font-size: var(--font-size-xs);
	}
</style>
