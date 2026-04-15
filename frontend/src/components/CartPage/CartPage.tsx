import type { MouseEvent } from 'react';
import { useCartContext } from '../../contexts/CartContext';
import styles from './CartPage.module.css';

interface CartPageProps {
  onBrowseProducts?: () => void;
  onProceedToCheckout?: () => void;
}

export function CartPage({ onBrowseProducts, onProceedToCheckout }: CartPageProps) {
  const { state, dispatch, cartTotal, isLoading, error } = useCartContext();
  const { items } = state;

  const handleDecrease = (productId: number, currentQuantity: number) => {
    const nextQuantity = Math.max(1, currentQuantity - 1);

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        productId,
        quantity: nextQuantity,
      },
    });
  };

  const handleIncrease = (productId: number, currentQuantity: number) => {
    const nextQuantity = Math.min(99, currentQuantity + 1);

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        productId,
        quantity: nextQuantity,
      },
    });
  };

  const handleRemove = (productId: number) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: {
        productId,
      },
    });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleProceedToCheckout = () => {
    onProceedToCheckout?.();
  };

  const handleBrowseProductsClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onBrowseProducts?.();
  };

  if (isLoading) {
    return (
      <section className={styles.cartPage} aria-label="Shopping cart page">
        <h2 className={styles.heading}>Your cart</h2>
        <p>Loading cart...</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className={styles.cartPage} aria-label="Shopping cart page">
        <h2 className={styles.heading}>Your cart</h2>
        {error && <p>{error}</p>}
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Your cart is empty.</p>
          <button
            type="button"
            className={styles.browseButton}
            onClick={handleBrowseProductsClick}
            aria-label="Browse products"
          >
            Browse products
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.cartPage} aria-label="Shopping cart page">
      <h2 className={styles.heading}>Your cart</h2>
      {error && <p>{error}</p>}
      <ul className={styles.cartList} aria-label="Cart items">
        {items.map((item) => {
          const lineTotal = item.price * item.quantity;

          return (
            <li key={item.productId} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.productName}</span>
                <span className={styles.itemPrice}>
                  ${item.price.toFixed(2)} each
                </span>
              </div>

              <div className={styles.itemControls}>
                <div className={styles.quantityControls}>
                  <button
                    type="button"
                    className={styles.qtyButton}
                    onClick={() => handleDecrease(item.productId, item.quantity)}
                    disabled={item.quantity === 1}
                    aria-label={`Decrease quantity for ${item.productName}`}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button
                    type="button"
                    className={styles.qtyButton}
                    onClick={() => handleIncrease(item.productId, item.quantity)}
                    aria-label={`Increase quantity for ${item.productName}`}
                  >
                    +
                  </button>
                </div>

                <span className={styles.lineTotal}>
                  ${lineTotal.toFixed(2)}
                </span>

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(item.productId)}
                  aria-label={`Remove ${item.productName} from cart`}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.summary}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Cart total</span>
          <span className={styles.totalValue}>${cartTotal.toFixed(2)}</span>
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearCart}
            aria-label="Clear cart"
          >
            Clear cart
          </button>
        </div>
        <button
          type="button"
          className={styles.checkoutButton}
          onClick={handleProceedToCheckout}
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
}
