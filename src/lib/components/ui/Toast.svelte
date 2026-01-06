<script lang="ts">
	import { toasts, dismissToast, type Toast } from '$stores/network';

	// Get reactive toasts
	let toastList = $derived($toasts);

	function getTypeStyles(type: Toast['type']): string {
		switch (type) {
			case 'success':
				return 'border-[var(--text-primary)] text-[var(--text-primary)]';
			case 'warning':
				return 'border-[var(--accent)] text-[var(--accent)]';
			case 'error':
				return 'border-red-500 text-red-500';
			default:
				return 'border-[var(--text-secondary)] text-[var(--text-secondary)]';
		}
	}

	function getIcon(type: Toast['type']): string {
		switch (type) {
			case 'success':
				return '[OK]';
			case 'warning':
				return '[!!]';
			case 'error':
				return '[XX]';
			default:
				return '[ii]';
		}
	}
</script>

{#if toastList.length > 0}
	<div class="toast-container">
		{#each toastList as toast (toast.id)}
			<div class="toast {getTypeStyles(toast.type)}" role="alert">
				<span class="toast-icon">{getIcon(toast.type)}</span>
				<span class="toast-message">{toast.message}</span>
				<button class="toast-dismiss" onclick={() => dismissToast(toast.id)} aria-label="Dismiss">
					[x]
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: 3rem;
		right: 1rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 400px;
		font-family: var(--font-mono);
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--bg-primary);
		border: 1px solid;
		font-size: 0.875rem;
		animation: slideIn 0.2s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.toast-icon {
		flex-shrink: 0;
		font-weight: 700;
	}

	.toast-message {
		flex: 1;
	}

	.toast-dismiss {
		flex-shrink: 0;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		opacity: 0.7;
	}

	.toast-dismiss:hover {
		opacity: 1;
	}
</style>
