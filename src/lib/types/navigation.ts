/**
 * Navigation Types
 */

export interface NavItem {
	id: string;
	label: string;
	icon?: string;
	children?: NavItem[];
	disabled?: boolean;
}
