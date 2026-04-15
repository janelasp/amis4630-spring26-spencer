import { useEffect, useState } from 'react';
import type { OrderResponse } from '../../types/order';
import { ApiError } from '../../services/apiClient';
import { getMyOrders } from '../../services/orderService';
import styles from './OrdersPage.module.css';

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to load orders.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return (
      <section className={styles.page} aria-label="Orders page">
        <h2 className={styles.heading}>My Orders</h2>
        <p>Loading orders…</p>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-label="Orders page">
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>My Orders</h2>
      </div>

      {error && (
        <p className={styles.error} role="alert" aria-label="Orders error">
          {error}
        </p>
      )}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className={styles.list} aria-label="Order list">
          {orders.map((order) => (
            <li key={order.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.orderId}>
                  {order.confirmationNumber || `Order #${order.id}`}
                </span>
                <span className={styles.total}>${order.total.toFixed(2)}</span>
              </div>
              <div className={styles.meta}>
                <span>{new Date(order.orderDate).toLocaleString()}</span>
                <span>{order.status}</span>
                <span>{order.items.length} items</span>
              </div>
              <ul className={styles.items} aria-label={`Items for order ${order.id}`}>
                {order.items.map((item) => (
                  <li key={item.id} className={styles.itemRow}>
                    <span className={styles.itemName}>{item.productName}</span>
                    <span className={styles.itemQty}>×{item.quantity}</span>
                    <span className={styles.itemTotal}>
                      ${item.lineTotal.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
