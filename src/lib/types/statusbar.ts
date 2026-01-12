import type { KeyboardAction } from '$lib/services/keyboard-manager';

export interface StatusKey {
	key: string;
	label: string;
	action: KeyboardAction;
	handler?: () => void;
}

