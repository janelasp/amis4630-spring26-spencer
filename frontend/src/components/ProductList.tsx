import {useState, useEffect} from 'react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductListProps {
    onProductClick: (id: number) => void;
}

export function ProductList({ onProductClick }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load products. Please try again.');
                setLoading(false);
            });
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