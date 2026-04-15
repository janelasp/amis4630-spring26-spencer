import type {
  CreateOrderRequest,
  OrderResponse,
  UpdateOrderStatusRequest,
} from '../types/order';
import { apiGet, apiPost, apiPut } from './apiClient';

export async function getMyOrders(): Promise<OrderResponse[]> {
  // Backend supports both `/orders` and `/orders/mine`; `/orders` keeps older servers compatible.
  return await apiGet<OrderResponse[]>('/orders');
}

export async function getOrderById(orderId: number): Promise<OrderResponse> {
  return await apiGet<OrderResponse>(`/orders/${orderId}`);
}

export async function createOrderFromCart(
  request: CreateOrderRequest,
): Promise<OrderResponse> {
  return await apiPost<OrderResponse, CreateOrderRequest>('/orders', request);
}

// Admin only
export async function getAllOrders(): Promise<OrderResponse[]> {
  return await apiGet<OrderResponse[]>('/orders/all');
}

// Admin only
export async function updateOrderStatus(
  orderId: number,
  status: string,
): Promise<OrderResponse> {
  const request: UpdateOrderStatusRequest = { status };
  return await apiPut<OrderResponse, UpdateOrderStatusRequest>(
    `/orders/${orderId}/status`,
    request,
  );
}
