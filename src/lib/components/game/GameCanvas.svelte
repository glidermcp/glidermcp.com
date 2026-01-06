<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		gameState,
		glider,
		obstacles,
		updateGame,
		spawnObstacle,
		GAME_CONFIG,
	} from '$stores/game';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number | null = null;
	let lastSpawnTime = 0;
	let canvasWidth = 0;
	let canvasHeight = 0;

	const state = $derived($gameState);
	const gliderState = $derived($glider);
	const obstacleList = $derived($obstacles);

	function resizeCanvas(): void {
		if (!canvas) return;

		const container = canvas.parentElement;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		canvasWidth = rect.width;
		canvasHeight = rect.height;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
	}

	function getThemeColors() {
		if (typeof window === 'undefined') {
			return {
				bg: '#000000',
				text: '#00ff00',
				accent: '#00ffff',
				dim: '#008800',
				error: '#ff4444',
			};
		}

		const style = getComputedStyle(document.documentElement);
		return {
			bg: style.getPropertyValue('--bg-primary').trim() || '#000000',
			text: style.getPropertyValue('--text-primary').trim() || '#00ff00',
			accent: style.getPropertyValue('--accent').trim() || '#00ffff',
			dim: style.getPropertyValue('--text-muted').trim() || '#008800',
			error: style.getPropertyValue('--error').trim() || '#ff4444',
		};
	}

	function drawGlider(colors: ReturnType<typeof getThemeColors>): void {
		if (!ctx) return;

		const g = gliderState;
		const x = GAME_CONFIG.GLIDER_X;
		const y = g.y;
		const size = GAME_CONFIG.GLIDER_SIZE;

		ctx.save();
		ctx.translate(x + size / 2, y + size / 2);
		ctx.rotate((g.rotation * Math.PI) / 180);
		ctx.translate(-(x + size / 2), -(y + size / 2));

		// Draw glider as ASCII-style shape
		ctx.fillStyle = colors.accent;
		ctx.font = `${size}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim() || 'monospace'}`;
		ctx.textBaseline = 'top';

		// Simple glider icon
		ctx.fillText('>', x, y);

		ctx.restore();
	}

	function drawObstacles(colors: ReturnType<typeof getThemeColors>): void {
		if (!ctx) return;

		const font = `${14}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim() || 'monospace'}`;

		for (const obs of obstacleList) {
			const x = obs.x;
			const gapY = obs.gapY;
			const gapHeight = obs.gapHeight;
			const width = GAME_CONFIG.OBSTACLE_WIDTH;

			// Draw top obstacle (filled area above gap)
			ctx.fillStyle = colors.dim;
			ctx.fillRect(x, 0, width, gapY);

			// Draw bottom obstacle (filled area below gap)
			ctx.fillRect(x, gapY + gapHeight, width, canvasHeight - gapY - gapHeight);

			// Draw borders
			ctx.strokeStyle = colors.text;
			ctx.lineWidth = 2;

			// Top obstacle border
			ctx.strokeRect(x, 0, width, gapY);

			// Bottom obstacle border
			ctx.strokeRect(x, gapY + gapHeight, width, canvasHeight - gapY - gapHeight);

			// Draw symbol in the gap area
			ctx.fillStyle = colors.text;
			ctx.font = font;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			const symbolX = x + width / 2;
			const symbolY = gapY + gapHeight / 2;

			ctx.fillText(obs.symbol, symbolX, symbolY);
		}
	}

	function drawBackground(colors: ReturnType<typeof getThemeColors>): void {
		if (!ctx) return;

		// Clear with background color
		ctx.fillStyle = colors.bg;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// Draw grid lines for terminal aesthetic
		ctx.strokeStyle = colors.dim + '33'; // Very dim
		ctx.lineWidth = 1;

		const gridSize = 40;

		// Vertical lines
		for (let x = 0; x < canvasWidth; x += gridSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvasHeight);
			ctx.stroke();
		}

		// Horizontal lines
		for (let y = 0; y < canvasHeight; y += gridSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvasWidth, y);
			ctx.stroke();
		}
	}

	function draw(): void {
		if (!ctx || canvasWidth === 0 || canvasHeight === 0) return;

		const colors = getThemeColors();

		drawBackground(colors);

		if (state === 'playing' || state === 'paused' || state === 'gameOver') {
			drawObstacles(colors);
			drawGlider(colors);
		}
	}

	function gameLoop(timestamp: number): void {
		if (state !== 'playing') {
			draw();
			animationId = requestAnimationFrame(gameLoop);
			return;
		}

		// Update game state
		updateGame(canvasHeight);

		// Spawn obstacles
		if (timestamp - lastSpawnTime > GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL) {
			spawnObstacle(canvasWidth, canvasHeight);
			lastSpawnTime = timestamp;
		}

		// Draw
		draw();

		animationId = requestAnimationFrame(gameLoop);
	}

	function startLoop(): void {
		if (animationId !== null) return;
		lastSpawnTime = performance.now();
		animationId = requestAnimationFrame(gameLoop);
	}

	function stopLoop(): void {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
	}

	onMount(() => {
		if (!canvas) return;

		ctx = canvas.getContext('2d');
		if (!ctx) return;

		resizeCanvas();
		startLoop();

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', resizeCanvas);
		}
	});

	onDestroy(() => {
		stopLoop();
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', resizeCanvas);
		}
	});

	// Restart loop when game becomes visible
	$effect(() => {
		if ($gameState && ctx) {
			if (animationId === null) {
				startLoop();
			}
		}
	});
</script>

<canvas bind:this={canvas} class="game-canvas"></canvas>

<style>
	.game-canvas {
		display: block;
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
	}
</style>
