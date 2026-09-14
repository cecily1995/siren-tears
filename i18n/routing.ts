import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'zh', 'fr', 'de', 'ru', 'ko', 'ja', 'it'],
  defaultLocale: 'en',
  // Always default to English at the root `/` regardless of the visitor's
  // browser/system language, and don't remember a past choice from a
  // shared cookie either -- every unprefixed link (e.g. someone opening a
  // link shared in WeChat) should land in English, with the language
  // switcher there for them to change it themselves.
  localeDetection: false,
  localePrefix: 'as-needed' // English at `/`, others at `/zh`, `/fr`, etc.
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '简体中文',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  ko: '한국어',
  ja: '日本語',
  it: 'Italiano'
};

export const localeShortNames: Record<Locale, string> = {
  en: 'EN',
  zh: '中',
  fr: 'FR',
  de: 'DE',
  ru: 'RU',
  ko: 'KO',
  ja: 'JA',
  it: 'IT'
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
