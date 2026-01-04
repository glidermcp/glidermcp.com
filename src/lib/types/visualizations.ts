/**
 * Visualization Types
 * Type definitions for ASCII visualization components
 */

/**
 * Tree node structure for ASCII tree visualization
 */
export interface TreeNode {
	name: string;
	type?: 'class' | 'interface' | 'base' | 'method' | 'property' | 'namespace' | 'file' | 'folder';
	children?: TreeNode[];
	meta?: string;
	collapsed?: boolean;
}

/**
 * Reference/usage node for ASCII graph visualization
 */
export interface ReferenceNode {
	location: string;
	line?: number;
	column?: number;
	snippet?: string;
	type?: 'usage' | 'definition' | 'implementation' | 'call' | 'assignment';
}

/**
 * Symbol with references
 */
export interface SymbolWithReferences {
	name: string;
	type?: 'class' | 'interface' | 'method' | 'property' | 'variable' | 'namespace';
	references: ReferenceNode[];
}

/**
 * File/folder node for solution explorer
 */
export interface SolutionNode {
	name: string;
	type: 'solution' | 'project' | 'folder' | 'file';
	children?: SolutionNode[];
	meta?: string;
	fileCount?: number;
}

/**
 * Timeline entry for request history
 */
export interface TimelineEntry {
	id: string;
	timestamp: number;
	toolName: string;
	duration: number;
	success: boolean;
	error?: string;
}
