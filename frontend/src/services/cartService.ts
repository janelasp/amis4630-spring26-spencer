import type {
  AddToCartRequest,
  CartApiResponse,
  CartItem,
  CartApiItem,
  UpdateCartItemRequest,
} from '../types/cart';
import { ApiError, apiDelete, apiRequest } from './apiClient';

export async function getCart(): Promise<CartApiResponse | null> {
  try {
    const response = await apiRequest('/cart', { method: 'GET' });
    return (await response.json()) as CartApiResponse;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 401)) {
      return null;
    }
    throw error;
  }
}

export async function addCartItem(request: AddToCartRequest): Promise<void> {
  await apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function updateCartItem(
  cartItemId: number,
  request: UpdateCartItemRequest,
): Promise<void> {
  await apiRequest(`/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

export async function deleteCartItem(cartItemId: number): Promise<void> {
  try {
    await apiDelete(`/cart/${cartItemId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return;
    }
    throw error;
  }
}

export async function clearCart(): Promise<void> {
  try {
    await apiDelete('/cart/clear');
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 401)) {
      return;
    }
    throw error;
  }
}

export function mapApiCartToItems(apiCart: CartApiResponse | null): CartItem[] {
	if (!apiCart) {
		return [];
	}

	return apiCart.items.map((item: CartApiItem) => ({
		id: item.id,
		productId: item.productId,
		productName: item.productName,
		price: item.price,
		quantity: item.quantity,
		imageUrl: item.imageUrl,
	}));
}
