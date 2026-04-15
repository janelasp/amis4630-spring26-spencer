import { useEffect, useMemo, useState } from 'react';
import type { ApiError } from '../../services/apiClient';
import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from '../../types/product';
import type { OrderResponse } from '../../types/order';
import * as productService from '../../services/productService';
import * as orderService from '../../services/orderService';
import styles from './AdminDashboard.module.css';

const ORDER_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Canceled'] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

function toErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const maybe = error as Partial<ApiError>;
    if (typeof maybe.message === 'string' && maybe.message.trim()) {
      return maybe.message;
    }
  }
  return 'Something went wrong. Please try again.';
}

const emptyProduct: CreateProductRequest = {
  title: '',
  description: '',
  price: 0,
  category: '',
  sellerName: '',
  imageUrl: '',
};

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<CreateProductRequest>(emptyProduct);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<UpdateProductRequest>(emptyProduct);

  const [statusByOrderId, setStatusByOrderId] = useState<Record<number, OrderStatus>>({});

  const refreshProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (e) {
      setError(toErrorMessage(e));
    } finally {
      setLoadingProducts(false);
    }
  };

  const refreshOrders = async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      const next: Record<number, OrderStatus> = {};
      for (const o of data) {
        const current = ORDER_STATUSES.find(
          (s) => s.toLowerCase() === o.status.toLowerCase(),
        );
        next[o.id] = current ?? 'Placed';
      }
      setStatusByOrderId(next);
    } catch (e) {
      setError(toErrorMessage(e));
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    void refreshProducts();
    void refreshOrders();
  }, []);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.id - b.id);
  }, [products]);

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      sellerName: product.sellerName,
      imageUrl: product.imageUrl,
    });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditingProduct(emptyProduct);
  };

  const handleCreateProduct = async () => {
    setError(null);
    try {
      await productService.createProduct(newProduct);
      setNewProduct(emptyProduct);
      await refreshProducts();
    } catch (e) {
      setError(toErrorMessage(e));
    }
  };

  const handleUpdateProduct = async () => {
    if (editingProductId === null) {
      return;
    }

    setError(null);
    try {
      await productService.updateProduct(editingProductId, editingProduct);
      cancelEdit();
      await refreshProducts();
    } catch (e) {
      setError(toErrorMessage(e));
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    setError(null);
    try {
      await productService.deleteProduct(productId);
      await refreshProducts();
    } catch (e) {
      setError(toErrorMessage(e));
    }
  };

  const handleUpdateOrderStatus = async (orderId: number) => {
    const status = statusByOrderId[orderId];
    if (!status) {
      return;
    }

    setError(null);
    try {
      const updated = await orderService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      setError(toErrorMessage(e));
    }
  };

  return (
    <div className={styles.container} aria-label="Admin dashboard">
      <h2>Admin Dashboard</h2>

      {error ? (
        <div className={styles.error} aria-label="Admin error">
          {error}
        </div>
      ) : null}

      <section className={styles.section} aria-label="Product management">
        <h3 className={styles.sectionTitle}>Product Management</h3>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Title</span>
            <input
              className={styles.input}
              aria-label="New product title"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            />
          </label>

          <label className={styles.field}>
            <span>Category</span>
            <input
              className={styles.input}
              aria-label="New product category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
          </label>

          <label className={styles.field}>
            <span>Seller Name</span>
            <input
              className={styles.input}
              aria-label="New product seller name"
              value={newProduct.sellerName}
              onChange={(e) =>
                setNewProduct({ ...newProduct, sellerName: e.target.value })
              }
            />
          </label>

          <label className={styles.field}>
            <span>Price</span>
            <input
              className={styles.input}
              aria-label="New product price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
            />
          </label>

          <label className={styles.field}>
            <span>Image URL</span>
            <input
              className={styles.input}
              aria-label="New product image url"
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
            />
          </label>

          <label className={styles.field}>
            <span>Description</span>
            <input
              className={styles.input}
              aria-label="New product description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </label>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.primary}`}
            aria-label="Create product"
            onClick={() => void handleCreateProduct()}
          >
            Add Product
          </button>
          <button
            type="button"
            className={styles.button}
            aria-label="Refresh products"
            onClick={() => void refreshProducts()}
          >
            Refresh
          </button>
        </div>

        {loadingProducts ? (
          <div className={styles.muted} aria-label="Loading products">
            Loading products...
          </div>
        ) : (
          <table className={styles.table} aria-label="Products table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <div>{p.title}</div>
                    <div className={styles.muted}>{p.category}</div>
                  </td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.button}
                        aria-label={`Edit product ${p.id}`}
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.danger}`}
                        aria-label={`Delete product ${p.id}`}
                        onClick={() => void handleDeleteProduct(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editingProductId !== null ? (
          <div aria-label="Edit product form">
            <h4>Edit Product #{editingProductId}</h4>

            <div className={styles.row}>
              <label className={styles.field}>
                <span>Title</span>
                <input
                  className={styles.input}
                  aria-label="Edit product title"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Category</span>
                <input
                  className={styles.input}
                  aria-label="Edit product category"
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Seller Name</span>
                <input
                  className={styles.input}
                  aria-label="Edit product seller name"
                  value={editingProduct.sellerName}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      sellerName: e.target.value,
                    })
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Price</span>
                <input
                  className={styles.input}
                  aria-label="Edit product price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Image URL</span>
                <input
                  className={styles.input}
                  aria-label="Edit product image url"
                  value={editingProduct.imageUrl}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      imageUrl: e.target.value,
                    })
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Description</span>
                <input
                  className={styles.input}
                  aria-label="Edit product description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.button} ${styles.primary}`}
                aria-label="Save product changes"
                onClick={() => void handleUpdateProduct()}
              >
                Save
              </button>
              <button
                type="button"
                className={styles.button}
                aria-label="Cancel product edit"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className={styles.section} aria-label="Order management">
        <h3 className={styles.sectionTitle}>All Orders</h3>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            aria-label="Refresh orders"
            onClick={() => void refreshOrders()}
          >
            Refresh
          </button>
        </div>

        {loadingOrders ? (
          <div className={styles.muted} aria-label="Loading orders">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.muted} aria-label="No orders">
            No orders yet.
          </div>
        ) : (
          <table className={styles.table} aria-label="Orders table">
            <thead>
              <tr>
                <th>Order</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div>#{o.id}</div>
                    <div className={styles.muted}>{o.confirmationNumber}</div>
                  </td>
                  <td>
                    <div className={styles.muted}>{o.userId}</div>
                  </td>
                  <td>${o.total.toFixed(2)}</td>
                  <td>
                    <select
                      className={styles.input}
                      aria-label={`Order ${o.id} status`}
                      value={statusByOrderId[o.id] ?? 'Placed'}
                      onChange={(e) => {
                        const value = e.target.value as OrderStatus;
                        setStatusByOrderId((prev) => ({ ...prev, [o.id]: value }));
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.primary}`}
                      aria-label={`Update status for order ${o.id}`}
                      onClick={() => void handleUpdateOrderStatus(o.id)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
