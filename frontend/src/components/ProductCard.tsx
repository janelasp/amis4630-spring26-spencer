import type { Product } from '../types/product';
import { AddToCartButton } from './AddToCartButton/AddToCartButton';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (id: number) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.title} className="product-image" />
            <h3>{product.title}</h3>
            <p>${product.price.toFixed(2)}</p>
            <p>Category: {product.category}</p>
            <p>Seller: {product.sellerName}</p>
            <button onClick={() => onViewDetails?.(product.id)}>View Details</button>
            <AddToCartButton
                product={{
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl,
                }}
            />
        </div>
    );
}

    