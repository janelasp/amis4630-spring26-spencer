import { useState } from 'react';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import './App.css';

function App() {
  //Track which view to show: list or detail
  const [view, setView] = useState<'list' | 'detail'>('list');
  
  //Store the ID of the product the user clicked on
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
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

  return (
    <div className="app">
      <header>
        <h1>Buckeye Marketplace</h1>
      </header>

      <main>
        {view === 'list' ? (
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

      export default App;
       
      