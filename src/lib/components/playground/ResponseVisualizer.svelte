<script lang="ts">
	import {
		ASCIITreeView,
		ASCIIGraph,
		SolutionExplorer,
		type TreeNode,
		type SymbolWithReferences,
		type ReferenceNode,
		type SolutionNode
	} from '$lib/components/visualizations';

	interface Props {
		toolId: string;
		data: unknown;
		onNavigate?: (location: string, line?: number) => void;
	}

	let { toolId, data, onNavigate }: Props = $props();

	// Determine visualization type based on tool
	type VisualizationType = 'tree' | 'graph' | 'solution' | 'raw';

	const visualizationType = $derived.by((): VisualizationType => {
		if (!data || typeof data !== 'object') return 'raw';

		switch (toolId) {
			case 'get_type_info':
			case 'get_method_signature':
				return 'tree';
			case 'find_usages':
			case 'find_implementation':
				return 'graph';
			case 'load_solution':
				return 'solution';
			default:
				return 'raw';
		}
	});

	// Convert response to tree format for type info
	const treeData = $derived.by((): TreeNode | null => {
		if (visualizationType !== 'tree' || !data) return null;

		const d = data as Record<string, unknown>;

		if (toolId === 'get_type_info') {
			return convertTypeInfoToTree(d);
		} else if (toolId === 'get_method_signature') {
			return convertMethodSignatureToTree(d);
		}

		return null;
	});

	// Convert response to graph format for find_usages
	const graphData = $derived.by((): SymbolWithReferences | null => {
		if (visualizationType !== 'graph' || !data) return null;

		const d = data as Record<string, unknown>;

		if (toolId === 'find_usages') {
			return convertFindUsagesToGraph(d);
		} else if (toolId === 'find_implementation') {
			return convertFindImplementationToGraph(d);
		}

		return null;
	});

	// Convert response to solution format
	const solutionData = $derived.by((): SolutionNode | null => {
		if (visualizationType !== 'solution' || !data) return null;

		const d = data as Record<string, unknown>;
		return convertToSolution(d);
	});

	function convertTypeInfoToTree(d: Record<string, unknown>): TreeNode {
		const children: TreeNode[] = [];

		// Base type
		if (d.baseType) {
			children.push({
				name: String(d.baseType),
				type: 'base',
				meta: '(base type)'
			});
		}

		// Interfaces
		const interfaces = d.interfaces as string[] | undefined;
		if (interfaces?.length) {
			children.push({
				name: 'Interfaces',
				type: 'namespace',
				children: interfaces.map((iface) => ({
					name: iface,
					type: 'interface' as const
				}))
			});
		}

		// Members
		const members = d.members as Array<Record<string, unknown>> | undefined;
		if (members?.length) {
			const methodChildren: TreeNode[] = [];
			const propertyChildren: TreeNode[] = [];

			for (const member of members) {
				const memberNode: TreeNode = {
					name: String(member.name || 'unknown'),
					type: member.kind === 'method' ? 'method' : 'property',
					meta: String(member.signature || member.type || '')
				};

				if (member.kind === 'method') {
					methodChildren.push(memberNode);
				} else {
					propertyChildren.push(memberNode);
				}
			}

			if (methodChildren.length) {
				children.push({
					name: `Methods (${methodChildren.length})`,
					type: 'namespace',
					children: methodChildren
				});
			}

			if (propertyChildren.length) {
				children.push({
					name: `Properties (${propertyChildren.length})`,
					type: 'namespace',
					children: propertyChildren
				});
			}
		}

		return {
			name: String(d.name || d.typeName || 'Type'),
			type: d.kind === 'interface' ? 'interface' : 'class',
			children,
			meta: d.namespace ? `in ${d.namespace}` : undefined
		};
	}

	function convertMethodSignatureToTree(d: Record<string, unknown>): TreeNode {
		const children: TreeNode[] = [];

		// Parameters
		const params = d.parameters as Array<Record<string, unknown>> | undefined;
		if (params?.length) {
			children.push({
				name: `Parameters (${params.length})`,
				type: 'namespace',
				children: params.map((p) => ({
					name: String(p.name || 'param'),
					type: 'property' as const,
					meta: String(p.type || '')
				}))
			});
		}

		// Return type
		if (d.returnType) {
			children.push({
				name: String(d.returnType),
				type: 'property',
				meta: '(return type)'
			});
		}

		return {
			name: String(d.name || d.methodName || 'Method'),
			type: 'method',
			children,
			meta: d.containingType ? `in ${d.containingType}` : undefined
		};
	}

	function convertFindUsagesToGraph(d: Record<string, unknown>): SymbolWithReferences {
		const usages = (d.usages || d.references || []) as Array<Record<string, unknown>>;

		return {
			name: String(d.symbolName || d.name || 'Symbol'),
			type: (d.symbolType as 'class' | 'interface' | 'method' | 'property') || 'class',
			references: usages.map((u) => ({
				location: String(u.filePath || u.file || u.location || 'unknown'),
				line: typeof u.line === 'number' ? u.line : undefined,
				column: typeof u.column === 'number' ? u.column : undefined,
				snippet: u.snippet ? String(u.snippet) : undefined,
				type: 'usage' as const
			}))
		};
	}

	function convertFindImplementationToGraph(d: Record<string, unknown>): SymbolWithReferences {
		const implementations = (d.implementations || []) as Array<Record<string, unknown>>;

		return {
			name: String(d.typeName || d.name || 'Type'),
			type: 'interface',
			references: implementations.map((impl) => ({
				location: String(impl.filePath || impl.file || impl.location || 'unknown'),
				line: typeof impl.line === 'number' ? impl.line : undefined,
				snippet: impl.typeName ? String(impl.typeName) : undefined,
				type: 'implementation' as const
			}))
		};
	}

	function convertToSolution(d: Record<string, unknown>): SolutionNode {
		const projects = (d.projects || []) as Array<Record<string, unknown>>;

		return {
			name: String(d.solutionName || d.name || 'Solution.sln'),
			type: 'solution',
			children: projects.map((p) => ({
				name: String(p.name || 'Project'),
				type: 'project' as const,
				fileCount: typeof p.fileCount === 'number' ? p.fileCount : undefined,
				meta: p.targetFramework ? String(p.targetFramework) : undefined
			}))
		};
	}

	function handleReferenceSelect(ref: ReferenceNode): void {
		onNavigate?.(ref.location, ref.line);
	}

	function handleNodeSelect(node: TreeNode | SolutionNode): void {
		// Could emit navigation event based on node metadata
	}
</script>

<div class="response-visualizer">
	{#if visualizationType === 'tree' && treeData}
		<ASCIITreeView
			data={treeData}
			title="Type Hierarchy"
			onNodeSelect={handleNodeSelect}
		/>
	{:else if visualizationType === 'graph' && graphData}
		<ASCIIGraph
			data={graphData}
			title={toolId === 'find_usages' ? 'Symbol References' : 'Implementations'}
			onReferenceSelect={handleReferenceSelect}
		/>
	{:else if visualizationType === 'solution' && solutionData}
		<SolutionExplorer
			data={solutionData}
			title="Solution Explorer"
			onNodeSelect={handleNodeSelect}
		/>
	{:else}
		<div class="raw-view">
			<div class="raw-header">Raw Response</div>
			<pre class="raw-content">{JSON.stringify(data, null, 2)}</pre>
		</div>
	{/if}
</div>

<style>
	.response-visualizer {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.raw-view {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.raw-header {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		border-bottom: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.raw-content {
		flex: 1;
		margin: 0;
		padding: var(--spacing-sm);
		overflow: auto;
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		color: var(--text-primary);
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>
