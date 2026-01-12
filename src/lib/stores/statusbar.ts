import { atom } from 'nanostores';
import type { StatusKey } from '$types/statusbar';

export const statusBarKeys = atom<StatusKey[] | null>(null);

export function setStatusBarKeys(keys: StatusKey[] | null): void {
	statusBarKeys.set(keys);
}

