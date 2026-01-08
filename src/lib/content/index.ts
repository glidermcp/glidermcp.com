import type { HomeContent, Locale } from './types';
import * as en from './en';

const contentByLocale: Record<Locale, HomeContent> = {
	en: {
		meta: en.meta,
		navItems: en.navItems,
		intro: en.intro,
		quickStart: en.quickStart,
		installation: en.installation,
		installationGuides: en.installationGuides,
		installationOther: en.installationOther,
		toolsList: en.toolsList,
		toolDetail: en.toolDetail,
		prompts: en.prompts,
		faq: en.faq,
		pricing: en.pricing,
		privacy: en.privacy
	}
};

export function getContent(locale: Locale = 'en'): HomeContent {
	return contentByLocale[locale] ?? contentByLocale.en;
}

export type { HomeContent, Locale } from './types';
