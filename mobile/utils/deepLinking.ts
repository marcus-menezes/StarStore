import * as Linking from 'expo-linking';
import { Share } from 'react-native';

import { t } from '@/i18n';
import type { Product } from '@/types';

const SCHEME = 'starstore';

/**
 * Creates a deep link URL for a specific product.
 * @example createProductUrl('abc123') => 'starstore://product/abc123'
 */
export function createProductUrl(productId: string): string {
  return Linking.createURL(`product/${productId}`, { scheme: SCHEME });
}

/**
 * Parses a deep link URL and extracts the product ID if it matches the product route.
 * @returns The product ID or `null` if the URL doesn't match.
 */
export function parseProductDeepLink(url: string): string | null {
  const parsed = Linking.parse(url);

  if (parsed.path?.startsWith('product/')) {
    return parsed.path.replace('product/', '');
  }

  if (parsed.path === 'product' && parsed.queryParams?.id) {
    return String(parsed.queryParams.id);
  }

  return null;
}

/**
 * Opens the native share dialog with a formatted message containing the product deep link.
 */
export async function shareProduct(product: Product): Promise<void> {
  const url = createProductUrl(product.id);
  const message = t('product.shareMessage').replace('{name}', product.name);

  await Share.share({
    message: `${message}\n\n${url}`,
    title: product.name,
  });
}
