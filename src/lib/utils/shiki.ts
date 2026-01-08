import type { Highlighter } from 'shiki';

const supportedLanguages = new Set([
	'bash',
	'json',
	'typescript',
	'csharp',
	'plaintext'
]);

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = import('shiki').then(({ createHighlighter }) =>
			createHighlighter({
				themes: ['github-dark', 'github-light'],
				langs: Array.from(supportedLanguages)
			})
		);
	}

	return highlighterPromise;
}

export function resolveLanguage(language: string) {
	return supportedLanguages.has(language) ? language : 'plaintext';
}
