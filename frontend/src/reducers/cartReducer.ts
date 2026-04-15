import type { CartItem, CartState, CartAction } from '../types/cart';

export const initialCartState: CartState = {
  items: [],
  isOpen: false,
  cartView: 'cart',
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find((item: CartItem) =>
        item.productId === action.payload.productId,
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item: CartItem) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      const newItem: CartItem = {
		id: 0,
        productId: action.payload.productId,
        productName: action.payload.productName,
        price: action.payload.price,
        quantity: 1,
        imageUrl: action.payload.imageUrl,
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter(
          (item: CartItem) => item.productId !== action.payload.productId,
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;

      // quantity < 1 removes the item
      if (quantity < 1) {
        return {
          ...state,
          items: state.items.filter(
            (item: CartItem) => item.productId !== productId,
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item: CartItem) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
        cartView: 'cart',
      };
    }

		case 'SET_CART_VIEW': {
			return {
				...state,
				cartView: action.payload.cartView,
			};
		}

		case 'SET_CART_FROM_SERVER': {
			return {
				...state,
				items: action.payload.items,
			};
		}
  }
}
