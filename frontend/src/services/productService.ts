import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from '../types/product';
import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';

export async function getAllProducts(): Promise<Product[]> {
  return await apiGet<Product[]>('/products');
}

// Admin only
export async function createProduct(request: CreateProductRequest): Promise<Product> {
  return await apiPost<Product, CreateProductRequest>('/products', request);
}

// Admin only
export async function updateProduct(
  productId: number,
  request: UpdateProductRequest,
): Promise<Product> {
  return await apiPut<Product, UpdateProductRequest>(`/products/${productId}`, request);
}

// Admin only
export async function deleteProduct(productId: number): Promise<void> {
  await apiDelete(`/products/${productId}`);
}
