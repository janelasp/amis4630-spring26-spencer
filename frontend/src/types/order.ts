export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderResponse {
  id: number;
  userId: string;
  orderDate: string;
  status: string;
  createdAtUtc: string;
  total: number;
  shippingAddress: string;
  confirmationNumber: string;
  items: OrderItemResponse[];
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}
