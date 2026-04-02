import { useState, useEffect, useRef } from 'react';
import { useCartContext } from '../../contexts/CartContext';
import styles from './AddToCartButton.module.css';

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCartContext();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });

    setAdded(true);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const label = `Add ${product.name} to cart`;

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      aria-label={label}
    >
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
