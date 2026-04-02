import { useState } from 'react';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { CartProvider, useCartContext } from './contexts/CartContext';
import { CartBadge } from './components/CartBadge/CartBadge';
import { CartPage } from './components/CartPage/CartPage';
import './App.css';

function AppContent() {
  //Track which view to show: list or detail
  const [view, setView] = useState<'list' | 'detail'>('list');

  //Store the ID of the product the user clicked on
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { state, dispatch } = useCartContext();

  //Function to switch to detail view
  const handleProductClick = (id: number) => {
    setSelectedId(id);
    setView('detail');
  };

  //Function to switch back to list view
  const handleBackToList = () => {
    setSelectedId(null);
    setView('list');
  };

  const handleBrowseProducts = () => {
    dispatch({ type: 'TOGGLE_CART' });
    setView('list');
  };

  return (
    <div className="app">
      <header>
        <h1>Buckeye Marketplace</h1>
        <CartBadge />
      </header>

      <main>
        {state.isOpen ? (
          <CartPage onBrowseProducts={handleBrowseProducts} />
        ) : view === 'list' ? (
          /* Show the List Page */
          <ProductList onProductClick={handleProductClick} />
        ) : (
          /* Show the Detail Page for the selected product */
          <ProductDetail productId={selectedId!} onBack={handleBackToList} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;

      
       
      