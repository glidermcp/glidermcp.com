<script lang="ts">
	import { connectionStatus, isConnected } from '$stores/playground';

	const status = $derived($connectionStatus);
	const connected = $derived($isConnected);

	function getStatusLabel(s: typeof status): string {
		switch (s) {
			case 'connected':
				return 'Connected';
			case 'connecting':
				return 'Connecting...';
			case 'disconnected':
				return 'Disconnected';
			case 'error':
				return 'Error';
			default:
				return 'Unknown';
		}
	}
</script>

<div class="connection-indicator" class:connected class:error={status === 'error'}>
	<span class="status-dot" class:pulse={status === 'connecting'}></span>
	<span class="status-text">{getStatusLabel(status)}</span>
</div>

<style>
	.connection-indicator {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-dim);
	}

	.connection-indicator.connected {
		color: var(--accent);
		border-color: var(--accent);
	}

	.connection-indicator.error {
		color: var(--error, #ff5555);
		border-color: var(--error, #ff5555);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--text-muted);
		flex-shrink: 0;
	}

	.connection-indicator.connected .status-dot {
		background-color: var(--accent);
	}

	.connection-indicator.error .status-dot {
		background-color: var(--error, #ff5555);
	}

	.status-dot.pulse {
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.4;
		}
		50% {
			opacity: 1;
		}
	}

	.status-text {
		white-space: nowrap;
	}
</style>
