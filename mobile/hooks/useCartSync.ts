import type { CartItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef } from 'react';

import { useAuth } from './useAuth';
import { useCartStore } from '@/store';

const CART_KEY_PREFIX = 'cart-user-';
const CART_GUEST_KEY = 'cart-guest';

function getCartKey(userId: string | null): string {
  return userId ? `${CART_KEY_PREFIX}${userId}` : CART_GUEST_KEY;
}

async function saveCart(key: string, items: CartItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error('[useCartSync] Failed to save cart:', error);
  }
}

async function loadCart(key: string): Promise<CartItem[]> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[useCartSync] Failed to load cart:', error);
    return [];
  }
}

async function removeCart(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('[useCartSync] Failed to remove cart:', error);
  }
}

/**
 * Merges guest cart items with user cart items.
 * For products in both carts, quantities are summed.
 * Products exclusive to either cart are kept.
 */
function mergeCarts(guestItems: CartItem[], userItems: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of userItems) {
    merged.set(item.product.id, { ...item });
  }

  for (const item of guestItems) {
    const existing = merged.get(item.product.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.set(item.product.id, { ...item });
    }
  }

  return Array.from(merged.values());
}

/**
 * Syncs the cart store with AsyncStorage based on auth state changes.
 *
 * - Guest -> Logged in: merges guest cart with user cart
 * - Logged in -> Guest: saves user cart, loads guest cart
 * - User A -> User B: saves user A cart, loads user B cart
 */
export function useCartSync(): void {
  const { user, isLoading } = useAuth();
  const previousUserIdRef = useRef<string | null | undefined>(undefined);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    const currentUserId = user?.id ?? null;

    // First run: just record the current user, don't swap
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      previousUserIdRef.current = currentUserId;
      return;
    }

    const previousUserId = previousUserIdRef.current;

    // No change
    if (previousUserId === currentUserId) return;

    const swapCart = async () => {
      const currentItems = useCartStore.getState().items;
      const previousKey = getCartKey(previousUserId ?? null);
      const newKey = getCartKey(currentUserId);

      // Save current cart to previous user's key
      await saveCart(previousKey, currentItems);

      // Load the new user's cart
      const newUserItems = await loadCart(newKey);

      // Guest -> Logged in user: merge carts
      if (previousUserId === null && currentUserId !== null) {
        const merged = mergeCarts(currentItems, newUserItems);
        useCartStore.getState().setItems(merged);
        // Clear guest cart since items were absorbed
        await removeCart(CART_GUEST_KEY);
      } else {
        // Logged in -> Guest, or User A -> User B: just load
        useCartStore.getState().setItems(newUserItems);
      }

      previousUserIdRef.current = currentUserId;
    };

    swapCart();
  }, [user, isLoading]);
}
