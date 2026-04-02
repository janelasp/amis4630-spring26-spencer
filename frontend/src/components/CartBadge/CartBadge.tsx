import { useCartContext } from '../../contexts/CartContext';
import styles from './CartBadge.module.css';

export function CartBadge() {
  const { cartItemCount, dispatch } = useCartContext();

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  return (
    <button
      type="button"
      className={styles.cartButton}
      onClick={handleClick}
      aria-label={`Shopping cart with ${cartItemCount} items`}
    >
      <span aria-hidden="true">🛒</span>{' '}
      {cartItemCount > 0 && (
        <span className={styles.badge}>{cartItemCount}</span>
      )}
    </button>
  );
}
