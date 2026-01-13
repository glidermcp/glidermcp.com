const supportedLanguages = new Set(['bash', 'json', 'typescript', 'csharp', 'plaintext'] as const);

export type SupportedLanguage = 'bash' | 'json' | 'typescript' | 'csharp' | 'plaintext';

export function resolveLanguage(language: string | undefined | null): SupportedLanguage {
	if (!language) return 'plaintext';

	const normalized = language.trim().toLowerCase();
	switch (normalized) {
		case 'sh':
		case 'shell':
		case 'zsh':
		case 'bash':
			return 'bash';
		case 'json':
			return 'json';
		case 'ts':
		case 'tsx':
		case 'typescript':
		case 'js':
		case 'jsx':
		case 'javascript':
			return 'typescript';
		case 'cs':
		case 'c#':
		case 'csharp':
			return 'csharp';
		case 'text':
		case 'plain':
		case 'plaintext':
			return 'plaintext';
		default:
			return supportedLanguages.has(normalized as SupportedLanguage) ? (normalized as SupportedLanguage) : 'plaintext';
	}
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

type TokenType =
	| 'comment'
	| 'string'
	| 'number'
	| 'boolean'
	| 'null'
	| 'keyword'
	| 'function'
	| 'class-name'
	| 'type'
	| 'property'
	| 'variable'
	| 'operator'
	| 'punctuation';

interface Pattern {
	type: TokenType;
	re: RegExp;
}

function lex(code: string, patterns: Pattern[]): string {
	let out = '';
	let i = 0;

	while (i < code.length) {
		let matched = false;

		for (const { type, re } of patterns) {
			re.lastIndex = i;
			const m = re.exec(code);
			if (!m || m.index !== i) continue;

			const text = m[0] ?? '';
			if (text.length === 0) continue;

			out += `<span class="token ${type}">${escapeHtml(text)}</span>`;
			i += text.length;
			matched = true;
			break;
		}

		if (!matched) {
			out += escapeHtml(code[i] ?? '');
			i += 1;
		}
	}

	return out;
}

const TS_KEYWORDS = [
	'as',
	'async',
	'await',
	'break',
	'case',
	'catch',
	'class',
	'const',
	'continue',
	'debugger',
	'default',
	'delete',
	'do',
	'else',
	'enum',
	'export',
	'extends',
	'false',
	'finally',
	'for',
	'function',
	'if',
	'import',
	'in',
	'instanceof',
	'interface',
	'let',
	'new',
	'null',
	'of',
	'private',
	'protected',
	'public',
	'return',
	'static',
	'switch',
	'this',
	'throw',
	'true',
	'try',
	'typeof',
	'var',
	'void',
	'while',
	'yield'
];

const CSHARP_KEYWORDS = [
	'abstract',
	'as',
	'async',
	'await',
	'base',
	'bool',
	'break',
	'byte',
	'case',
	'catch',
	'char',
	'checked',
	'class',
	'const',
	'continue',
	'decimal',
	'default',
	'delegate',
	'do',
	'double',
	'else',
	'enum',
	'event',
	'explicit',
	'extern',
	'false',
	'finally',
	'fixed',
	'float',
	'for',
	'foreach',
	'goto',
	'if',
	'implicit',
	'in',
	'int',
	'interface',
	'internal',
	'is',
	'lock',
	'long',
	'namespace',
	'new',
	'null',
	'object',
	'operator',
	'out',
	'override',
	'params',
	'private',
	'protected',
	'public',
	'readonly',
	'ref',
	'return',
	'sbyte',
	'sealed',
	'short',
	'sizeof',
	'stackalloc',
	'static',
	'string',
	'struct',
	'switch',
	'this',
	'throw',
	'true',
	'try',
	'typeof',
	'uint',
	'ulong',
	'unchecked',
	'unsafe',
	'ushort',
	'using',
	'virtual',
	'void',
	'volatile',
	'while',
	'record',
	'with',
	'required',
	'init'
];

function keywordsPattern(keywords: string[]): RegExp {
	// Sticky so we can scan left-to-right without backtracking surprises.
	return new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'y');
}

const TS_PATTERNS: Pattern[] = [
	{ type: 'comment', re: /\/\/[^\n\r]*/y },
	{ type: 'comment', re: /\/\*[\s\S]*?\*\//y },
	{ type: 'string', re: /`(?:\\.|[^`\\])*`/y },
	{ type: 'string', re: /'(?:\\.|[^'\\])*'/y },
	{ type: 'string', re: /"(?:\\.|[^"\\])*"/y },
	{ type: 'number', re: /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/iy },
	{ type: 'keyword', re: keywordsPattern(TS_KEYWORDS) },
	// Highlight function names: foo( ... )
	{ type: 'function', re: /\b[A-Za-z_$][\w$]*\b(?=\s*\()/y },
	{ type: 'operator', re: /=>|===|!==|==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|&&|\|\||[+\-*/%&|^!<>]=?|[?:~]/y },
	{ type: 'punctuation', re: /[{}[\];(),.]/y }
];

const CSHARP_PATTERNS: Pattern[] = [
	{ type: 'comment', re: /\/\/[^\n\r]*/y },
	{ type: 'comment', re: /\/\*[\s\S]*?\*\//y },
	// Verbatim and interpolated verbatim strings: @"..." / $@"..."
	{ type: 'string', re: /\$?@\"(?:\"\"|[^\"])*\"/y },
	{ type: 'string', re: /'(?:\\.|[^'\\])*'/y },
	{ type: 'string', re: /"(?:\\.|[^"\\])*"/y },
	{ type: 'number', re: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[mMfFdD]?\b/y },
	{ type: 'keyword', re: keywordsPattern(CSHARP_KEYWORDS) },
	// Types starting with upper-case (best-effort)
	{ type: 'type', re: /\b[A-Z][A-Za-z0-9_]*\b/y },
	{ type: 'function', re: /\b[A-Za-z_][A-Za-z0-9_]*\b(?=\s*\()/y },
	{ type: 'operator', re: /=>|==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|&&|\|\||[+\-*/%&|^!<>]=?|[?:~]/y },
	{ type: 'punctuation', re: /[{}[\];(),.]/y }
];

const JSON_PATTERNS: Pattern[] = [
	{ type: 'property', re: /"(?:\\.|[^"\\])*"(?=\s*:)/y },
	{ type: 'string', re: /"(?:\\.|[^"\\])*"/y },
	{ type: 'number', re: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y },
	{ type: 'boolean', re: /\b(?:true|false)\b/y },
	{ type: 'null', re: /\bnull\b/y },
	{ type: 'punctuation', re: /[{}\[\]:,]/y }
];

const BASH_PATTERNS: Pattern[] = [
	{ type: 'comment', re: /#[^\n\r]*/y },
	{ type: 'string', re: /'(?:[^']*)'/y },
	{ type: 'string', re: /"(?:\\.|[^"\\])*"/y },
	{ type: 'variable', re: /\$(?:\{[A-Za-z_][A-Za-z0-9_]*\}|[A-Za-z_][A-Za-z0-9_]*)/y },
	{ type: 'operator', re: /\|\||&&|\||;|>>|>|<|2>|&/y },
	{ type: 'punctuation', re: /[(){}[\]]/y }
];

export function highlightToHtml(code: string, language: SupportedLanguage): string {
	if (!code) return '';

	switch (language) {
		case 'bash':
			return lex(code, BASH_PATTERNS);
		case 'json':
			return lex(code, JSON_PATTERNS);
		case 'typescript':
			return lex(code, TS_PATTERNS);
		case 'csharp':
			return lex(code, CSHARP_PATTERNS);
		default:
			return escapeHtml(code);
	}
}
