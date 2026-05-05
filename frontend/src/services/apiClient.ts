import type { AuthResponse } from '../types/auth';
import { emitAuthLogout } from './authEvents';
import {
  clearStoredAuth,
  getAccessToken,
  loadStoredAuth,
  saveStoredAuth,
} from './tokenStorage';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

function getApiBaseUrl(): string {
  const configured = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  const base = configured.trim() || DEFAULT_API_BASE_URL;
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export class ApiError extends Error {
  public status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

let refreshInFlight: Promise<boolean> | null = null;

function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.accessToken === 'string' &&
    typeof record.refreshToken === 'string' &&
    typeof record.expiresAtUtc === 'string'
  );
}

async function tryRefreshAccessToken(): Promise<boolean> {
  const stored = loadStoredAuth();
  if (!stored?.refreshToken) {
    return false;
  }

  if (refreshInFlight) {
    return await refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: stored.refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = (await response.json()) as unknown;
      if (!isAuthResponse(data)) {
        return false;
      }

      saveStoredAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAtUtc: data.expiresAtUtc,
      });

      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return await refreshInFlight;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const body = (await response.json()) as unknown;
      if (typeof body === 'object' && body !== null) {
        const record = body as Record<string, unknown>;
        const message =
          (typeof record.Message === 'string' && record.Message) ||
          (typeof record.message === 'string' && record.message);
        if (message) {
          return message;
        }
        if (Array.isArray(record.Errors)) {
          const errors = record.Errors.filter((e): e is string => typeof e === 'string');
          if (errors.length > 0) {
            return errors.join('\n');
          }
        }

        // ASP.NET Core ValidationProblemDetails: { errors: { Field: ["msg", ...] } }
        if (typeof record.errors === 'object' && record.errors !== null) {
          const errorsRecord = record.errors as Record<string, unknown>;
          const messages: string[] = [];
          for (const value of Object.values(errorsRecord)) {
            if (Array.isArray(value)) {
              for (const entry of value) {
                if (typeof entry === 'string') {
                  messages.push(entry);
                }
              }
            }
          }
          if (messages.length > 0) {
            return messages.join('\n');
          }
        }
      }
    }

    const text = await response.text();
    return text || `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
}

export async function apiRequest(
  path: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  const url = buildUrl(path);

  const buildHeaders = (): Headers => {
    const headers = new Headers(options.headers);

    if (!options.skipAuth) {
      const token = getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const hasBody = typeof options.body !== 'undefined' && options.body !== null;
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    if (hasBody && !isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  };

  const makeRequest = async (): Promise<Response> => {
    const headers = buildHeaders();
    return await fetch(url, {
      ...options,
      headers,
    });
  };

  let response = await makeRequest();

  // Centralized auth handling: refresh + retry once on 401/403.
  if (
    !response.ok &&
    !options.skipAuth &&
    (response.status === 401 || response.status === 403) &&
    // Avoid infinite loops on the refresh endpoint.
    !path.startsWith('/auth/refresh')
  ) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      response = await makeRequest();
    }

    if (!response.ok && (response.status === 401 || response.status === 403)) {
      clearStoredAuth();
      emitAuthLogout();
    }
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new ApiError(message, response.status);
  }

  return response;
}

export async function apiGet<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await apiRequest(path, {
    ...options,
    method: 'GET',
  });

  return (await response.json()) as T;
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const response = await apiRequest(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });

  return (await response.json()) as TResponse;
}

export async function apiPut<TResponse, TBody>(
  path: string,
  body: TBody,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const response = await apiRequest(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return (await response.json()) as TResponse;
}

export async function apiDelete(path: string, options: ApiRequestOptions = {}): Promise<void> {
  await apiRequest(path, {
    ...options,
    method: 'DELETE',
  });
}
