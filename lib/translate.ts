import { unstable_cache } from 'next/cache';

// Maps our site locales to DeepL's target-language codes.
// DeepL doesn't need an entry for English (source == target, no call made).
const DEEPL_TARGET_LANG: Record<string, string> = {
  zh: 'ZH',
  fr: 'FR',
  de: 'DE',
  ru: 'RU',
  ko: 'KO',
  ja: 'JA',
  it: 'IT'
};

async function callDeepL(text: string, targetLang: string): Promise<string | null> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) return null;

  // DeepL free-tier keys end in ":fx" and use a different host than paid keys.
  const isFreeKey = apiKey.trim().endsWith(':fx');
  const endpoint = isFreeKey
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        source_lang: 'EN',
        preserve_formatting: true
      })
    });

    if (!res.ok) {
      console.error('DeepL translate failed', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data?.translations?.[0]?.text ?? null;
  } catch (err) {
    console.error('DeepL translate error', err);
    return null;
  }
}

// Cached for 30 days per (text, locale) pair -- product copy rarely
// changes, and this avoids re-translating (and re-paying for) the same
// text on every page view.
const cachedTranslate = unstable_cache(
  async (text: string, targetLang: string) => callDeepL(text, targetLang),
  ['deepl-translate'],
  { revalidate: 60 * 60 * 24 * 30 }
);

/**
 * Translates English CMS copy into the given site locale using DeepL.
 * Returns the original English text unchanged if the locale is English,
 * the text is empty, no DEEPL_API_KEY is configured, or the call fails --
 * so this always degrades gracefully to showing the English original
 * rather than breaking the page.
 */
export async function translateText(
  text: string | undefined | null,
  locale: string
): Promise<string> {
  if (!text) return '';
  const targetLang = DEEPL_TARGET_LANG[locale];
  if (!targetLang) return text; // English, or an unmapped locale

  const translated = await cachedTranslate(text, targetLang);
  return translated || text;
}

/** Translates several fields for the same locale in parallel. */
export async function translateFields<T extends Record<string, string | undefined | null>>(
  fields: T,
  locale: string
): Promise<Record<keyof T, string>> {
  const entries = Object.entries(fields);
  const translated = await Promise.all(
    entries.map(([, value]) => translateText(value, locale))
  );
  return Object.fromEntries(entries.map(([key], i) => [key, translated[i]])) as Record<
    keyof T,
    string
  >;
}
