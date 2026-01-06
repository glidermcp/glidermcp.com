import type { NavItem } from '$types/navigation';

export type Locale = 'en';

export interface PageMeta {
	title: string;
	description: string;
}

export interface CodeSample {
	code: string;
	language: string;
}

export interface IntroContent {
	title: string;
	tagline: string;
	paragraphs: string[];
	featuresTitle: string;
	features: string[];
	quickInstallTitle: string;
	quickInstall: CodeSample;
	hint: string;
}

export interface SectionBlock {
	title: string;
	paragraphs?: string[];
	list?: string[];
	code?: CodeSample;
}

export interface QuickStartContent {
	title: string;
	intro: string;
	sections: SectionBlock[];
}

export interface ClientCard {
	id: string;
	name: string;
	desc: string;
}

export interface InstallationContent {
	title: string;
	intro: string[];
	hint: string;
	ariaLabel: string;
	clients: ClientCard[];
	notFoundText: string;
}

export interface InstallStep {
	title: string;
	description?: string;
	code?: string;
	language?: string;
}

export interface InstallationGuide {
	id: string;
	title: string;
	subtitle: string;
	cardTitle: string;
	steps: InstallStep[];
}

export type InstallationGuides = Record<string, InstallationGuide>;

export interface OtherInstallSection {
	title: string;
	description?: string;
	code?: CodeSample;
}

export interface OtherInstallContent {
	id: string;
	title: string;
	subtitle: string;
	sections: OtherInstallSection[];
}

export interface ToolsListContent {
	title: string;
	intro: string;
}

export interface ToolDetailContent {
	parametersTitle: string;
	examplesTitle: string;
	responseTitle: string;
	tableHeaders: {
		name: string;
		type: string;
		required: string;
		description: string;
	};
	requiredLabels: {
		yes: string;
		no: string;
	};
	noParametersText: string;
	notFoundText: string;
	hint: string;
}

export interface PromptGroup {
	title: string;
	description: string;
	prompts: string[];
}

export interface PromptsContent {
	title: string;
	intro: string;
	groups: PromptGroup[];
}

export interface FaqItem {
	question: string;
	answer: string[];
}

export interface FaqContent {
	title: string;
	items: FaqItem[];
}

export interface PricingContent {
	title: string;
	planName: string;
	price: string;
	features: string[];
	versionPolicyTitle: string;
	versionPolicy: string[];
	updateCode: CodeSample;
	authorTitle: string;
	authorLabel: string;
	authorName: string;
	authorUrl: string;
	authorEmail: string;
	licenseTitle: string;
	licenseText: string;
}

export interface HomeContent {
	meta: PageMeta;
	navItems: NavItem[];
	intro: IntroContent;
	quickStart: QuickStartContent;
	installation: InstallationContent;
	installationGuides: InstallationGuides;
	installationOther: OtherInstallContent;
	toolsList: ToolsListContent;
	toolDetail: ToolDetailContent;
	prompts: PromptsContent;
	faq: FaqContent;
	pricing: PricingContent;
}
