/**
 * MCP (Model Context Protocol) Type Definitions
 */

/**
 * JSON-RPC 2.0 request format
 */
export interface JsonRpcRequest {
	jsonrpc: '2.0';
	id: string | number;
	method: string;
	params?: Record<string, unknown>;
}

/**
 * JSON-RPC 2.0 response format
 */
export interface JsonRpcResponse<T = unknown> {
	jsonrpc: '2.0';
	id: string | number;
	result?: T;
	error?: JsonRpcError;
}

/**
 * JSON-RPC 2.0 error format
 */
export interface JsonRpcError {
	code: number;
	message: string;
	data?: unknown;
}

/**
 * MCP Tool call response
 */
export interface MCPToolResponse<T = unknown> {
	content: Array<{
		type: 'text' | 'image' | 'resource';
		text?: string;
		data?: T;
	}>;
	isError?: boolean;
}

/**
 * Connection status
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * MCP Server health response
 */
export interface HealthResponse {
	status: 'ok' | 'error';
	version?: string;
	timestamp?: string;
	solutionLoaded?: boolean;
	solutionPath?: string;
}

/**
 * Server status response
 */
export interface ServerStatusResponse {
	running: boolean;
	version?: string;
	solutionLoaded: boolean;
	solutionPath?: string;
	projectCount?: number;
}

/**
 * Type info from get_type_info
 */
export interface TypeInfo {
	name: string;
	fullName: string;
	kind: 'class' | 'interface' | 'struct' | 'enum' | 'delegate' | 'record';
	namespace: string;
	filePath: string;
	lineNumber: number;
	baseType?: string;
	interfaces?: string[];
	members?: MemberInfo[];
	documentation?: string;
}

/**
 * Member info
 */
export interface MemberInfo {
	name: string;
	kind: 'method' | 'property' | 'field' | 'event' | 'constructor';
	type?: string;
	accessibility: 'public' | 'private' | 'protected' | 'internal';
	isStatic?: boolean;
	isAbstract?: boolean;
	isVirtual?: boolean;
	signature?: string;
}

/**
 * Method signature from get_method_signature
 */
export interface MethodSignature {
	name: string;
	returnType: string;
	parameters: ParameterInfo[];
	typeParameters?: string[];
	documentation?: string;
	filePath: string;
	lineNumber: number;
}

/**
 * Parameter info
 */
export interface ParameterInfo {
	name: string;
	type: string;
	hasDefaultValue?: boolean;
	defaultValue?: string;
	isOptional?: boolean;
	isParams?: boolean;
}

/**
 * Usage location from find_usages
 */
export interface UsageLocation {
	filePath: string;
	lineNumber: number;
	column?: number;
	snippet?: string;
	kind?: 'definition' | 'reference' | 'implementation';
}

/**
 * Type search result from find_types
 */
export interface TypeSearchResult {
	name: string;
	fullName: string;
	kind: string;
	filePath: string;
	lineNumber: number;
}

/**
 * Implementation result from find_implementation
 */
export interface ImplementationResult {
	typeName: string;
	fullName: string;
	filePath: string;
	lineNumber: number;
}

/**
 * Solution load result
 */
export interface SolutionLoadResult {
	path: string;
	projects: ProjectInfo[];
	success: boolean;
	error?: string;
}

/**
 * Project info
 */
export interface ProjectInfo {
	name: string;
	path: string;
	targetFramework?: string;
	outputType?: string;
}
