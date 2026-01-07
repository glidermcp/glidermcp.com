/**
 * Navigation Types
 */

export interface NavItem {
	id: string;
	label: string;
	href: string;
	icon?: string;
	children?: NavItem[];
	disabled?: boolean;
}
