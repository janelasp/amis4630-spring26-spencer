import type {AddToCartRequest, CartApiResponse, CartItem, CartApiItem, UpdateCartItemRequest} from '../types/cart';

const CART_BASE_URL = 'http://localhost:5000/api/cart';

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error(`Cart API error: ${response.status} ${response.statusText}`);
	}

	return (await response.json()) as T;
}

export async function getCart(): Promise<CartApiResponse | null> {
	const response = await fetch(CART_BASE_URL);

	if (response.status === 404) {
		return null;
	}

	return await parseJsonOrThrow<CartApiResponse>(response);
}

export async function addCartItem(request: AddToCartRequest): Promise<void> {
	const response = await fetch(CART_BASE_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(request),
	});

	if (!response.ok) {
		throw new Error(`Failed to add to cart: ${response.status}`);
	}
}

export async function updateCartItem(
	cartItemId: number,
	request: UpdateCartItemRequest,
): Promise<void> {
	const response = await fetch(`${CART_BASE_URL}/${cartItemId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(request),
	});

	if (!response.ok) {
		throw new Error(`Failed to update cart item: ${response.status}`);
	}
}

export async function deleteCartItem(cartItemId: number): Promise<void> {
	const response = await fetch(`${CART_BASE_URL}/${cartItemId}`, {
		method: 'DELETE',
	});

	if (response.status === 404) {
		// Treat missing item as already-deleted
		return;
	}

	if (!response.ok) {
		throw new Error(`Failed to delete cart item: ${response.status}`);
	}
}

export async function clearCart(): Promise<void> {
	const response = await fetch(`${CART_BASE_URL}/clear`, {
		method: 'DELETE',
	});

	if (response.status === 404) {
		// No cart yet; treat as cleared
		return;
	}

	if (!response.ok) {
		throw new Error(`Failed to clear cart: ${response.status}`);
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
