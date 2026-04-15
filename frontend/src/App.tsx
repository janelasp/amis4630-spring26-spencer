import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { CartProvider, useCartContext } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartBadge } from './components/CartBadge/CartBadge';
import { CartPage } from './components/CartPage/CartPage';
import { CheckoutPage } from './components/CheckoutPage/CheckoutPage';
import { LoginPage } from './components/LoginPage/LoginPage';
import { RegisterPage } from './components/RegisterPage/RegisterPage';
import { OrdersPage } from './components/OrdersPage/OrdersPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage/OrderConfirmationPage';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { RequireRole } from './components/RequireRole/RequireRole';
import { AuthStatus } from './components/AuthStatus/AuthStatus';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import './App.css';

function ProductListRoute() {
  const navigate = useNavigate();

  return (
    <ProductList
      onProductClick={(id) => {
        navigate(`/products/${id}`);
      }}
    />
  );
}

function ProductDetailRoute() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const id = Number(productId);
  if (!Number.isFinite(id)) {
    return <Navigate to="/" replace />;
  }

  return <ProductDetail productId={id} onBack={() => navigate('/')} />;
}

function CheckoutRoute() {
  const navigate = useNavigate();
  const { state, dispatch } = useCartContext();

  const handleBackToCart = () => {
    if (!state.isOpen) {
      dispatch({ type: 'TOGGLE_CART' });
    }
    navigate('/', { replace: true });
  };

  return <CheckoutPage onBackToCart={handleBackToCart} />;
}

function AppLayout() {
  const navigate = useNavigate();
  const { state, dispatch } = useCartContext();

  const handleBrowseProducts = () => {
    if (state.isOpen) {
      dispatch({ type: 'TOGGLE_CART' });
    }
    navigate('/');
  };

  const handleProceedToCheckout = () => {
    if (state.isOpen) {
      dispatch({ type: 'TOGGLE_CART' });
    }
    navigate('/checkout');
  };

  return (
    <div className="app">
      <header>
        <h1>
          <Link to="/" className="appTitle">
            Buckeye Marketplace
          </Link>
        </h1>
        <div className="headerActions" aria-label="Header actions">
          <AuthStatus />
          <CartBadge />
        </div>
      </header>

      <main>
        {state.isOpen ? (
          <CartPage
            onBrowseProducts={handleBrowseProducts}
            onProceedToCheckout={handleProceedToCheckout}
          />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<ProductListRoute />} />
              <Route path="products/:productId" element={<ProductDetailRoute />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route
                path="checkout"
                element={
                  <RequireAuth>
                    <CheckoutRoute />
                  </RequireAuth>
                }
              />
              <Route
                path="orders"
                element={
                  <RequireAuth>
                    <OrdersPage />
                  </RequireAuth>
                }
              />
              <Route
                path="admin"
                element={
                  <RequireRole role="Admin">
                    <AdminDashboard />
                  </RequireRole>
                }
              />
              <Route
                path="order-confirmation/:orderId"
                element={
                  <RequireAuth>
                    <OrderConfirmationPage />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

      
       
      