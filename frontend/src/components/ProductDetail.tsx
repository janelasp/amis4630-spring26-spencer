import type { Product } from '../types/product';
import {useState, useEffect} from 'react';

interface ProductDetailProps {
    productId: number;
    onBack: () => void;
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (productId === null) return;
        fetch(`http://localhost:5000/api/products/${productId}`)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching product details:', err);
                setLoading(false);
            });
    
}, [productId]);
 
    if (loading) return <div>Loading product details...</div>;
    if (!product) return <div>Product not found.</div>;

    return (
        <div className="product-detail">
            <button onClick={onBack} style={{ marginBottom: '20px' }}> Back to List</button>

            <div style={{ display: 'flex', gap: '30px' }}>
                <img src={product.imageUrl} alt={product.title} style={{ maxWidth: '400px', height: '300px', objectFit: 'cover' }} />
                <div>
                    <h2>{product.title}</h2>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    <p><strong>Seller:</strong> {product.sellerName}</p>
                    <p><strong>Posted on:</strong> {new Date(product.postedDate).toLocaleDateString()}</p>
                   <hr />
                   <p><strong>Description:</strong></p>
                   <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
}