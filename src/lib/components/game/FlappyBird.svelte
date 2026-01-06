<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import GameCanvas from './GameCanvas.svelte';
	import {
		gameVisible,
		gameState,
		score,
		highScore,
		hideGame,
		startGame,
		resetGame,
		jump,
	} from '$stores/game';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { setModalOpen } from '$stores/keyboard';

	const visible = $derived($gameVisible);
	const state = $derived($gameState);
	const currentScore = $derived($score);
	const best = $derived($highScore);

	let unsubscribe: (() => void) | null = null;

	function handleKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		if (!$gameVisible) return false;

		switch (action) {
			case 'back':
				handleClose();
				return true;
			case 'select':
			case 'execute':
				if ($gameState === 'idle' || $gameState === 'gameOver') {
					startGame();
				} else {
					jump();
				}
				return true;
			default:
				return false;
		}
	}

	function handleSpace(event: KeyboardEvent): void {
		if (!$gameVisible) return;
		if (event.code === 'Space' || event.key === ' ') {
			event.preventDefault();
			if ($gameState === 'idle' || $gameState === 'gameOver') {
				startGame();
			} else {
				jump();
			}
		}
	}

	function handleClose(): void {
		hideGame();
		setModalOpen(false);
	}

	function handleCanvasClick(): void {
		if ($gameState === 'idle' || $gameState === 'gameOver') {
			startGame();
		} else {
			jump();
		}
	}

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleKeyboard);
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleSpace);
		}
	});

	onDestroy(() => {
		unsubscribe?.();
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleSpace);
		}
	});

	$effect(() => {
		setModalOpen($gameVisible);
	});
</script>

{#if visible}
	<div class="game-overlay" role="dialog" aria-modal="true" aria-label="Flappy Glider Game">
		<div class="game-container">
			<header class="game-header">
				<span class="box-tl">┌</span>
				<span class="box-h"></span>
				<span class="title">FLAPPY GLIDER</span>
				<span class="box-h"></span>
				<span class="box-tr">┐</span>
			</header>

			<div class="game-body">
				<span class="border-left">│</span>
				<div class="game-content">
					<div class="score-bar">
						<span class="score-label">SCORE: <span class="score-value">{currentScore}</span></span>
						<span class="score-label">BEST: <span class="score-value">{best}</span></span>
					</div>

					<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
					<div class="canvas-wrapper" onclick={handleCanvasClick} role="application" aria-label="Game area - click or press space to jump">
						<GameCanvas />

						{#if state === 'idle'}
							<div class="game-message">
								<div class="ascii-glider">
									<pre>{`    ___
   /   \\
  | o   |====>
   \\___/`}</pre>
								</div>
								<p class="instruction">Press SPACE or Click to Start</p>
								<p class="hint">Navigate through C# symbols!</p>
							</div>
						{:else if state === 'gameOver'}
							<div class="game-message game-over">
								<p class="title-text">GAME OVER</p>
								<p class="final-score">Score: {currentScore}</p>
								{#if currentScore === best && currentScore > 0}
									<p class="new-record">NEW HIGH SCORE!</p>
								{/if}
								<p class="instruction">Press SPACE to Try Again</p>
							</div>
						{/if}
					</div>

					<div class="controls-hint">
						<span>SPACE / Click = Jump</span>
						<span>ESC = Close</span>
					</div>
				</div>
				<span class="border-right">│</span>
			</div>

			<footer class="game-footer">
				<span class="box-bl">└</span>
				<span class="box-h"></span>
				<button class="close-btn" onclick={handleClose}>[ ESC Close ]</button>
				<span class="box-h"></span>
				<span class="box-br">┘</span>
			</footer>
		</div>
	</div>
{/if}

<style>
	.game-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.95);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		font-family: var(--font-mono);
	}

	.game-container {
		display: flex;
		flex-direction: column;
		max-width: 600px;
		width: 90%;
		max-height: 90vh;
	}

	.game-header {
		display: flex;
		align-items: center;
		color: var(--accent);
		line-height: 1;
	}

	.game-header .title {
		padding: 0 var(--spacing-md);
		white-space: nowrap;
		font-weight: bold;
		letter-spacing: 2px;
	}

	.box-tl, .box-tr, .box-bl, .box-br {
		flex-shrink: 0;
	}

	.box-h {
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.box-h::before {
		content: '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────';
		position: absolute;
		white-space: nowrap;
		color: var(--accent);
	}

	.game-body {
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.border-left,
	.border-right {
		color: var(--accent);
		display: flex;
		flex-direction: column;
		white-space: pre;
	}

	.border-left::before,
	.border-right::before {
		content: '│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│';
		color: var(--accent);
	}

	.game-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: var(--spacing-md);
		gap: var(--spacing-md);
	}

	.score-bar {
		display: flex;
		justify-content: space-between;
		color: var(--text-primary);
		font-size: var(--font-size-base);
	}

	.score-value {
		color: var(--accent);
		font-weight: bold;
	}

	.canvas-wrapper {
		flex: 1;
		position: relative;
		border: 1px solid var(--border-dim);
		background-color: var(--bg-primary);
		min-height: 300px;
		cursor: pointer;
	}

	.game-message {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		color: var(--text-primary);
	}

	.ascii-glider {
		color: var(--accent);
		margin-bottom: var(--spacing-lg);
	}

	.ascii-glider pre {
		margin: 0;
		font-size: var(--font-size-lg);
		line-height: 1.2;
	}

	.instruction {
		color: var(--text-secondary);
		margin: var(--spacing-md) 0;
		animation: blink 1s infinite;
	}

	.hint {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.game-over .title-text {
		font-size: 1.5rem;
		color: var(--error);
		margin-bottom: var(--spacing-md);
	}

	.final-score {
		font-size: var(--font-size-lg);
		color: var(--text-primary);
	}

	.new-record {
		color: var(--warning);
		margin-top: var(--spacing-sm);
		animation: blink 0.5s infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.controls-hint {
		display: flex;
		justify-content: center;
		gap: var(--spacing-lg);
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.game-footer {
		display: flex;
		align-items: center;
		color: var(--accent);
		line-height: 1;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: var(--accent);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		cursor: pointer;
		padding: 0 var(--spacing-md);
		white-space: nowrap;
	}

	.close-btn:hover {
		color: var(--text-primary);
	}

	.close-btn:focus {
		outline: none;
	}

	.close-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.instruction,
		.new-record {
			animation: none;
		}
	}
</style>
