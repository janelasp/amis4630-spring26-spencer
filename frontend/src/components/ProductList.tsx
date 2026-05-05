import { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import { getAllProducts } from '../services/productService';
import { ProductCard } from './ProductCard';

interface ProductListProps {
    onProductClick: (id: number) => void;
}

export function ProductList({ onProductClick }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllProducts();
                if (isMounted) {
                    setProducts(data);
                }
            } catch {
                if (isMounted) {
                    setError('Failed to load products. Please try again.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return <div>Loading products...</div>;
    if (error) return <div>{error}</div>;
    if (products.length === 0) return <div>No products found.</div>;

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={onProductClick} />
            ))}
        </div>
    );
}