import { CheckoutForm } from '../CheckoutForm/CheckoutForm';
import styles from './CheckoutPage.module.css';

interface CheckoutPageProps {
  onBackToCart: () => void;
}

export function CheckoutPage({ onBackToCart }: CheckoutPageProps) {
  return (
    <section className={styles.checkoutPage} aria-label="Checkout page">
      <button
        type="button"
        className={styles.backButton}
        onClick={onBackToCart}
        aria-label="Back to cart"
      >
        ← Back to cart
      </button>

      <CheckoutForm />
    </section>
  );
}