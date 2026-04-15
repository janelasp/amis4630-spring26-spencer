export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
}

export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
}

export interface AuthState {
  status: 'anonymous' | 'authenticated';
  auth: StoredAuth | null;
}

export type AuthAction =
  | { type: 'RESTORE_AUTH'; payload: { auth: StoredAuth | null } }
  | { type: 'LOGIN_SUCCESS'; payload: { auth: StoredAuth } }
  | { type: 'LOGOUT' };
