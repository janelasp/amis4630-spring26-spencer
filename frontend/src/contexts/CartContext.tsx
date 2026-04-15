import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cartReducer, initialCartState } from '../reducers/cartReducer';
import type { CartState, CartAction } from '../types/cart';
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  mapApiCartToItems,
  updateCartItem,
} from '../services/cartService';
import { useAuthContext } from './AuthContext';
import {
  clearGuestCartItems,
  loadGuestCartItems,
  saveGuestCartItems,
} from '../services/guestCartStorage';

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartItemCount: number;
  cartTotal: number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { isAuthenticated } = useAuthContext();
  const [state, baseDispatch] = useReducer(cartReducer, initialCartState);
  const [lastAction, setLastAction] = useState<CartAction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const prevIsAuthenticated = useRef(isAuthenticated);

  const dispatch = (action: CartAction) => {
    baseDispatch(action);

    switch (action.type) {
      case 'ADD_TO_CART':
      case 'REMOVE_FROM_CART':
      case 'UPDATE_QUANTITY':
      case 'CLEAR_CART': {
        setLastAction(action);
        break;
      }
      case 'TOGGLE_CART':
      case 'SET_CART_VIEW':
      case 'SET_CART_FROM_SERVER': {
        // local-only or server-driven updates; no API call
        break;
      }
    }
  };

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!isAuthenticated) {
          const items = loadGuestCartItems();
          if (!isMounted) {
            return;
          }

          baseDispatch({
            type: 'SET_CART_FROM_SERVER',
            payload: { items },
          });
          return;
        }

        const guestItems = loadGuestCartItems();
        if (guestItems.length > 0) {
          for (const item of guestItems) {
            await addCartItem({
              productId: item.productId,
              quantity: item.quantity,
            });
          }
          clearGuestCartItems();
        }

        const apiCart = await getCart();
        if (!isMounted) {
          return;
        }

        const items = mapApiCartToItems(apiCart);
        baseDispatch({
          type: 'SET_CART_FROM_SERVER',
          payload: { items },
        });
      } catch (error) {
        console.error('Failed to load cart', error);
        if (isMounted) {
          setError('Failed to load cart. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const wasAuthenticated = prevIsAuthenticated.current;
    prevIsAuthenticated.current = isAuthenticated;

    if (wasAuthenticated && !isAuthenticated) {
      saveGuestCartItems(state.items);
    }
  }, [isAuthenticated, state.items]);

  useEffect(() => {
    if (lastAction === null) {
      return;
    }

    let isCancelled = false;

    const syncCart = async () => {
      try {
        if (!isAuthenticated) {
          saveGuestCartItems(state.items);
          if (!isCancelled) {
            setError(null);
          }
          return;
        }

        switch (lastAction.type) {
          case 'ADD_TO_CART': {
            await addCartItem({
              productId: lastAction.payload.productId,
              quantity: 1,
            });
            break;
          }
          case 'UPDATE_QUANTITY': {
            const existingItem = state.items.find(
              (item) => item.productId === lastAction.payload.productId,
            );

            if (!existingItem || existingItem.id === 0) {
              break;
            }

            await updateCartItem(existingItem.id, {
              quantity: lastAction.payload.quantity,
            });
            break;
          }
          case 'REMOVE_FROM_CART': {
            const existingItem = state.items.find(
              (item) => item.productId === lastAction.payload.productId,
            );

            if (!existingItem || existingItem.id === 0) {
              break;
            }

            await deleteCartItem(existingItem.id);
            break;
          }
          case 'CLEAR_CART': {
            await clearCart();
            break;
          }
          case 'TOGGLE_CART':
          case 'SET_CART_FROM_SERVER': {
            return;
          }
        }

        const apiCart = await getCart();
        if (isCancelled) {
          return;
        }

        const items = mapApiCartToItems(apiCart);
        baseDispatch({
          type: 'SET_CART_FROM_SERVER',
          payload: { items },
        });
        if (!isCancelled) {
          setError(null);
        }
      } catch (error) {
        console.error('Failed to sync cart with API', error);

        if (!isCancelled) {
          setError('Failed to update cart. Please try again.');
        }

        try {
          const apiCart = await getCart();
          if (!isCancelled) {
            const items = mapApiCartToItems(apiCart);
            baseDispatch({
              type: 'SET_CART_FROM_SERVER',
              payload: { items },
            });
          }
        } catch {
          // ignore secondary failure
        }
      } finally {
        if (!isCancelled) {
          setLastAction(null);
        }
      }
    };

    void syncCart();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, lastAction, state.items]);

  const value: CartContextValue = {
    state,
    dispatch,
    cartItemCount,
    cartTotal,
    isLoading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error('useCartContext must be used within a CartProvider');
  }

  return context;
}
