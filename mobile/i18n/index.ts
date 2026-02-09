import ptBR from './locales/pt-BR';

// Current active locale (hardcoded for now, can be made dynamic later)
const activeLocale = ptBR;

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
 * To switch language in the future, change `activeLocale` to point
 * to a different locale file.
 */
export function t(key: TranslationKey): string {
  const parts = key.split('.');
  let result: unknown = activeLocale;

  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = (result as Record<string, unknown>)[part];
    } else {
      console.warn(`[i18n] Missing translation key: "${key}"`);
      return key;
    }
  }

  return result as string;
}
