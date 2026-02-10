import { useLocaleStore } from '@/store/localeStore';
import type { Locale } from '@/store/localeStore';
import en from './locales/en';
import ptBR from './locales/pt-BR';

const locales: Record<Locale, typeof ptBR> = {
  'pt-BR': ptBR,
  en: en as typeof ptBR,
};

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

type TranslationKey = NestedKeyOf<typeof ptBR>;

/**
 * Returns the translated string for the given key.
 * Keys use dot notation: 'login.title', 'validation.emailRequired', etc.
 *
 * Reads the current locale from the locale store synchronously.
 */
export function t(key: TranslationKey): string {
  const locale = useLocaleStore.getState().locale;
  const activeLocale = locales[locale];

  const parts = key.split('.');
  let result: unknown = activeLocale;

  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = (result as Record<string, unknown>)[part];
    } else {
      console.warn(`[i18n] Missing translation key: "${key}" for locale "${locale}"`);
      return key;
    }
  }

  return result as string;
}
