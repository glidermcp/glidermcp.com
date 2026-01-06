/**
 * Audio Manager Service
 * Handles 8-bit style sound effects for the game using Web Audio API
 */

type SoundType = 'jump' | 'score' | 'gameOver' | 'start';

class AudioManager {
	private context: AudioContext | null = null;
	private muted = false;
	private initialized = false;

	/**
	 * Initialize the audio context (must be called after user interaction)
	 */
	init(): void {
		if (this.initialized || typeof window === 'undefined') return;

		try {
			this.context = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
			this.initialized = true;
		} catch {
			console.warn('Web Audio API not supported');
		}
	}

	/**
	 * Resume audio context if suspended (browsers require user interaction)
	 */
	private async ensureResumed(): Promise<void> {
		if (this.context?.state === 'suspended') {
			await this.context.resume();
		}
	}

	/**
	 * Play a sound effect
	 */
	async play(type: SoundType): Promise<void> {
		if (this.muted || !this.context) return;

		await this.ensureResumed();

		switch (type) {
			case 'jump':
				this.playJump();
				break;
			case 'score':
				this.playScore();
				break;
			case 'gameOver':
				this.playGameOver();
				break;
			case 'start':
				this.playStart();
				break;
		}
	}

	/**
	 * Jump sound - quick ascending blip
	 */
	private playJump(): void {
		if (!this.context) return;

		const osc = this.context.createOscillator();
		const gain = this.context.createGain();

		osc.connect(gain);
		gain.connect(this.context.destination);

		osc.type = 'square';
		osc.frequency.setValueAtTime(300, this.context.currentTime);
		osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.1);

		gain.gain.setValueAtTime(0.15, this.context.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

		osc.start(this.context.currentTime);
		osc.stop(this.context.currentTime + 0.1);
	}

	/**
	 * Score sound - positive chime (two quick ascending notes)
	 */
	private playScore(): void {
		if (!this.context) return;

		const playNote = (freq: number, startTime: number, duration: number) => {
			const osc = this.context!.createOscillator();
			const gain = this.context!.createGain();

			osc.connect(gain);
			gain.connect(this.context!.destination);

			osc.type = 'square';
			osc.frequency.setValueAtTime(freq, startTime);

			gain.gain.setValueAtTime(0.12, startTime);
			gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

			osc.start(startTime);
			osc.stop(startTime + duration);
		};

		const now = this.context.currentTime;
		playNote(523, now, 0.08); // C5
		playNote(659, now + 0.08, 0.12); // E5
	}

	/**
	 * Game over sound - descending sad tone
	 */
	private playGameOver(): void {
		if (!this.context) return;

		const osc = this.context.createOscillator();
		const gain = this.context.createGain();

		osc.connect(gain);
		gain.connect(this.context.destination);

		osc.type = 'sawtooth';
		osc.frequency.setValueAtTime(440, this.context.currentTime);
		osc.frequency.exponentialRampToValueAtTime(110, this.context.currentTime + 0.5);

		gain.gain.setValueAtTime(0.15, this.context.currentTime);
		gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.3);
		gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

		osc.start(this.context.currentTime);
		osc.stop(this.context.currentTime + 0.5);
	}

	/**
	 * Start sound - quick startup jingle
	 */
	private playStart(): void {
		if (!this.context) return;

		const playNote = (freq: number, startTime: number, duration: number) => {
			const osc = this.context!.createOscillator();
			const gain = this.context!.createGain();

			osc.connect(gain);
			gain.connect(this.context!.destination);

			osc.type = 'square';
			osc.frequency.setValueAtTime(freq, startTime);

			gain.gain.setValueAtTime(0.1, startTime);
			gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

			osc.start(startTime);
			osc.stop(startTime + duration);
		};

		const now = this.context.currentTime;
		playNote(262, now, 0.08); // C4
		playNote(330, now + 0.08, 0.08); // E4
		playNote(392, now + 0.16, 0.12); // G4
	}

	/**
	 * Toggle mute state
	 */
	toggleMute(): boolean {
		this.muted = !this.muted;
		return this.muted;
	}

	/**
	 * Set mute state
	 */
	setMuted(muted: boolean): void {
		this.muted = muted;
	}

	/**
	 * Get current mute state
	 */
	isMuted(): boolean {
		return this.muted;
	}
}

// Singleton instance
export const audioManager = new AudioManager();
