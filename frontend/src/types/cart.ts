export interface CartItem {
	id: number;
	productId: number;
	productName: string;
	price: number;
	quantity: number;
	imageUrl?: string;
}

export interface CartState {
	items: CartItem[];
	isOpen: boolean;
}

export type CartAction =
	| {
			type: 'ADD_TO_CART';
			payload: {
				productId: number;
				productName: string;
				price: number;
				imageUrl?: string;
			};
		}
	| {
			type: 'REMOVE_FROM_CART';
			payload: {
				productId: number;
			};
		}
	| {
			type: 'UPDATE_QUANTITY';
			payload: {
				productId: number;
				quantity: number;
			};
		}
	| {
			type: 'CLEAR_CART';
		}
	| {
			type: 'TOGGLE_CART';
		}
	| {
			type: 'SET_CART_FROM_SERVER';
			payload: {
				items: CartItem[];
			};
		};

export interface CartApiItem {
	id: number;
	productId: number;
	productName: string;
	price: number;
	imageUrl?: string;
	quantity: number;
	lineTotal: number;
}

export interface CartApiResponse {
	id: number;
	userId: string;
	items: CartApiItem[];
	totalItems: number;
	subtotal: number;
	total: number;
	createdAt: string;
	updatedAt: string;
}

export interface AddToCartRequest {
	productId: number;
	quantity: number;
}

export interface UpdateCartItemRequest {
	quantity: number;
}
