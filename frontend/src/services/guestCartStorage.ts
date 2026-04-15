import type { CartItem } from '../types/cart';

const GUEST_CART_STORAGE_KEY = 'buckeyeMarketplace.guestCart';

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'number' &&
    typeof record.productId === 'number' &&
    typeof record.productName === 'string' &&
    typeof record.price === 'number' &&
    typeof record.quantity === 'number' &&
    (typeof record.imageUrl === 'undefined' || typeof record.imageUrl === 'string')
  );
}

function normalizeGuestItem(item: CartItem): CartItem {
  return {
    ...item,
    id: 0,
  };
}

export function loadGuestCartItems(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const items = parsed.filter(isCartItem).map(normalizeGuestItem);
    return items;
  } catch {
    return [];
  }
}

export function saveGuestCartItems(items: CartItem[]): void {
  const normalized = items.map(normalizeGuestItem);
  window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(normalized));
}

export function clearGuestCartItems(): void {
  window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
}
