/**
 * Game State Store
 * Manages Flappy Bird game state
 */

import { atom, computed } from 'nanostores';

// Game configuration
export const GAME_CONFIG = {
	GRAVITY: 0.5,
	JUMP_FORCE: -8,
	OBSTACLE_SPEED: 3,
	OBSTACLE_GAP: 150,
	OBSTACLE_WIDTH: 60,
	OBSTACLE_SPAWN_INTERVAL: 2000,
	GLIDER_SIZE: 24,
	GLIDER_X: 80,
} as const;

// C# code symbols used as obstacles
export const CODE_SYMBOLS = [
	'class',
	'interface',
	'struct',
	'enum',
	'async',
	'await',
	'namespace',
	'public',
	'private',
	'static',
	'void',
	'return',
	'using',
	'new',
	'this',
	'base',
	'null',
	'true',
	'false',
	'var',
	'{',
	'}',
	'[',
	']',
	'=>',
	'<T>',
	'Task',
	'IEnumerable',
	'List<>',
	'Dictionary',
	'LINQ',
	'System',
	'.NET',
];

export interface Obstacle {
	id: string;
	x: number;
	gapY: number;
	gapHeight: number;
	symbol: string;
	passed: boolean;
}

export interface Glider {
	y: number;
	velocity: number;
	rotation: number;
}

export type GameState = 'idle' | 'playing' | 'paused' | 'gameOver';

// Stores
export const gameState = atom<GameState>('idle');
export const score = atom<number>(0);
export const highScore = atom<number>(0);
export const glider = atom<Glider>({ y: 200, velocity: 0, rotation: 0 });
export const obstacles = atom<Obstacle[]>([]);
export const gameVisible = atom<boolean>(false);

// Derived
export const isPlaying = computed(gameState, (state: GameState) => state === 'playing');
export const isGameOver = computed(gameState, (state: GameState) => state === 'gameOver');
export const isIdle = computed(gameState, (state: GameState) => state === 'idle');

// Load high score from localStorage
if (typeof window !== 'undefined') {
	const stored = localStorage.getItem('glider-highscore');
	if (stored) {
		highScore.set(parseInt(stored, 10) || 0);
	}
}

/**
 * Show the game modal
 */
export function showGame(): void {
	gameVisible.set(true);
	resetGame();
}

/**
 * Hide the game modal
 */
export function hideGame(): void {
	gameVisible.set(false);
	gameState.set('idle');
}

/**
 * Start the game
 */
export function startGame(): void {
	if (gameState.get() === 'playing') return;

	resetGame();
	gameState.set('playing');
}

/**
 * Reset game to initial state
 */
export function resetGame(): void {
	score.set(0);
	glider.set({ y: 200, velocity: 0, rotation: 0 });
	obstacles.set([]);
	gameState.set('idle');
}

/**
 * Make the glider jump
 */
export function jump(): void {
	if (gameState.get() === 'idle') {
		startGame();
	}

	if (gameState.get() !== 'playing') return;

	const g = glider.get();
	glider.set({
		...g,
		velocity: GAME_CONFIG.JUMP_FORCE,
		rotation: -20,
	});
}

/**
 * End the game
 */
export function endGame(): void {
	gameState.set('gameOver');

	const currentScore = score.get();
	const currentHigh = highScore.get();

	if (currentScore > currentHigh) {
		highScore.set(currentScore);
		if (typeof window !== 'undefined') {
			localStorage.setItem('glider-highscore', currentScore.toString());
		}
	}
}

/**
 * Update game state (called each frame)
 */
export function updateGame(canvasHeight: number): void {
	if (gameState.get() !== 'playing') return;

	// Update glider
	const g = glider.get();
	const newVelocity = g.velocity + GAME_CONFIG.GRAVITY;
	const newY = g.y + newVelocity;
	const newRotation = Math.min(90, Math.max(-30, g.rotation + 2));

	// Check bounds collision
	if (newY < 0 || newY > canvasHeight - GAME_CONFIG.GLIDER_SIZE) {
		endGame();
		return;
	}

	glider.set({
		y: newY,
		velocity: newVelocity,
		rotation: newRotation,
	});

	// Update obstacles
	const obs = obstacles.get();
	const updatedObs = obs
		.map((o: Obstacle) => {
			const newX = o.x - GAME_CONFIG.OBSTACLE_SPEED;

			// Check if passed
			if (!o.passed && newX + GAME_CONFIG.OBSTACLE_WIDTH < GAME_CONFIG.GLIDER_X) {
				score.set(score.get() + 1);
				return { ...o, x: newX, passed: true };
			}

			return { ...o, x: newX };
		})
		.filter((o: Obstacle) => o.x > -GAME_CONFIG.OBSTACLE_WIDTH);

	obstacles.set(updatedObs);

	// Check collision with obstacles
	const gliderY = glider.get().y;
	const gliderX = GAME_CONFIG.GLIDER_X;
	const gliderSize = GAME_CONFIG.GLIDER_SIZE;

	for (const o of updatedObs) {
		// Check if glider is within obstacle x range
		if (gliderX + gliderSize > o.x && gliderX < o.x + GAME_CONFIG.OBSTACLE_WIDTH) {
			// Check if outside the gap
			if (gliderY < o.gapY || gliderY + gliderSize > o.gapY + o.gapHeight) {
				endGame();
				return;
			}
		}
	}
}

/**
 * Spawn a new obstacle
 */
export function spawnObstacle(canvasWidth: number, canvasHeight: number): void {
	if (gameState.get() !== 'playing') return;

	const gapY = 50 + Math.random() * (canvasHeight - GAME_CONFIG.OBSTACLE_GAP - 100);
	const symbol = CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)];

	const newObstacle: Obstacle = {
		id: `obs-${Date.now()}-${Math.random().toString(36).substring(7)}`,
		x: canvasWidth,
		gapY,
		gapHeight: GAME_CONFIG.OBSTACLE_GAP,
		symbol,
		passed: false,
	};

	obstacles.set([...obstacles.get(), newObstacle]);
}

/**
 * Toggle pause
 */
export function togglePause(): void {
	const current = gameState.get();
	if (current === 'playing') {
		gameState.set('paused');
	} else if (current === 'paused') {
		gameState.set('playing');
	}
}
