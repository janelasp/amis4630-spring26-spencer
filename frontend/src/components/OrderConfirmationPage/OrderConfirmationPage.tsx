import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { OrderResponse } from '../../types/order';
import { ApiError } from '../../services/apiClient';
import { getOrderById } from '../../services/orderService';
import styles from './OrderConfirmationPage.module.css';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const id = Number(orderId);
      if (!Number.isFinite(id)) {
        setError('Invalid order id.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getOrderById(id);
        if (isMounted) {
          setOrder(data);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to load order confirmation.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <section className={styles.page} aria-label="Order confirmation page">
        <h2 className={styles.heading}>Order Confirmed</h2>
        <p>Loading confirmation…</p>
      </section>
    );
  }

  if (error || order === null) {
    return (
      <section className={styles.page} aria-label="Order confirmation page">
        <h2 className={styles.heading}>Order Confirmed</h2>
        <p className={styles.error} role="alert" aria-label="Order confirmation error">
          {error ?? 'Order not found.'}
        </p>
        <div className={styles.actions} aria-label="Order confirmation actions">
          <Link to="/orders" className={styles.linkButton} aria-label="Go to my orders">
            View My Orders
          </Link>
          <Link to="/" className={styles.secondaryLink} aria-label="Continue shopping">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-label="Order confirmation page">
      <h2 className={styles.heading}>Order Confirmed</h2>
      <p className={styles.subheading}>
        Confirmation: <span className={styles.mono}>{order.confirmationNumber}</span>
      </p>

      <div className={styles.card} aria-label="Order details">
        <div className={styles.row}>
          <span className={styles.label}>Status</span>
          <span className={styles.value}>{order.status}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Order Date</span>
          <span className={styles.value}>{new Date(order.orderDate).toLocaleString()}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Shipping Address</span>
          <span className={styles.value}>{order.shippingAddress}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Total</span>
          <span className={styles.value}>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.card} aria-label="Order items">
        <h3 className={styles.cardHeading}>Items</h3>
        <ul className={styles.items} aria-label="Confirmed items">
          {order.items.map((item) => (
            <li key={item.id} className={styles.itemRow}>
              <span className={styles.itemName}>{item.productName}</span>
              <span className={styles.itemQty}>×{item.quantity}</span>
              <span className={styles.itemTotal}>${item.lineTotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions} aria-label="Order confirmation actions">
        <Link to="/orders" className={styles.linkButton} aria-label="Go to my orders">
          View My Orders
        </Link>
        <Link to="/" className={styles.secondaryLink} aria-label="Continue shopping">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
