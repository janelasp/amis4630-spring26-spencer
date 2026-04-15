import { getAccessToken } from './tokenStorage';

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

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const body = (await response.json()) as unknown;
      if (typeof body === 'object' && body !== null) {
        const record = body as Record<string, unknown>;
        if (typeof record.Message === 'string') {
          return record.Message;
        }
        if (Array.isArray(record.Errors)) {
          const errors = record.Errors.filter((e): e is string => typeof e === 'string');
          if (errors.length > 0) {
            return errors.join('\n');
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

  const response = await fetch(url, {
    ...options,
    headers,
  });

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
