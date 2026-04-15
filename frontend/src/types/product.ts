export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
  postedDate: string;
  imageUrl: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
  imageUrl: string;
}

export interface UpdateProductRequest extends CreateProductRequest {}