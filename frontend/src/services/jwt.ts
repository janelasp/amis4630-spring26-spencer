function base64UrlToBase64(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return normalized + '='.repeat(padLength);
}

function decodeBase64UrlJson(value: string): unknown {
  const base64 = base64UrlToBase64(value);
  type BufferLike = {
    from: (value: string, encoding: string) => {
      toString: (encoding: string) => string;
    };
  };

  const decode =
    typeof atob === 'function'
      ? atob
      : (v: string) => {
          const buffer = (globalThis as unknown as { Buffer?: BufferLike }).Buffer;
          if (!buffer) {
            throw new Error('Base64 decoder unavailable');
          }
          return buffer.from(v, 'base64').toString('utf-8');
        };
  const json = decode(base64);
  return JSON.parse(json) as unknown;
}

export function getJwtPayload(accessToken: string): Record<string, unknown> | null {
  const parts = accessToken.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = decodeBase64UrlJson(parts[1]);
    if (typeof payload === 'object' && payload !== null) {
      return payload as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function coerceStringArray(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  return [];
}

export function getJwtRoles(accessToken: string): string[] {
  const payload = getJwtPayload(accessToken);
  if (!payload) {
    return [];
  }

  // Depending on claim mapping, roles may appear under different keys.
  const possibleKeys = [
    'role',
    'roles',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role',
  ];

  for (const key of possibleKeys) {
    const roles = coerceStringArray(payload[key]);
    if (roles.length > 0) {
      return roles;
    }
  }

  return [];
}

export function tokenHasRole(accessToken: string, role: string): boolean {
  const roles = getJwtRoles(accessToken);
  return roles.some((r) => r.toLowerCase() === role.toLowerCase());
}
