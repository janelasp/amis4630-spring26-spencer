import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { apiPost } from './apiClient';

export async function login(request: LoginRequest): Promise<AuthResponse> {
  return await apiPost<AuthResponse, LoginRequest>('/auth/login', request, {
    skipAuth: true,
  });
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
  return await apiPost<AuthResponse, RegisterRequest>('/auth/register', request, {
    skipAuth: true,
  });
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  return await apiPost<AuthResponse, { refreshToken: string }>(
    '/auth/refresh',
    { refreshToken },
    { skipAuth: true },
  );
}
