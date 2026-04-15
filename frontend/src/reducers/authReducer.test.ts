import { describe, expect, it } from 'vitest';
import { authReducer, initialAuthState } from './authReducer';
import type { StoredAuth } from '../types/auth';

describe('authReducer', () => {
  const storedAuth: StoredAuth = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresAtUtc: '2099-01-01T00:00:00Z',
  };

  it('RESTORE_AUTH with null sets anonymous state', () => {
    const state = authReducer(
      { status: 'authenticated', auth: storedAuth },
      { type: 'RESTORE_AUTH', payload: { auth: null } },
    );

    expect(state).toEqual({ status: 'anonymous', auth: null });
  });

  it('RESTORE_AUTH with stored auth sets authenticated state', () => {
    const state = authReducer(initialAuthState, {
      type: 'RESTORE_AUTH',
      payload: { auth: storedAuth },
    });

    expect(state.status).toBe('authenticated');
    expect(state.auth).toEqual(storedAuth);
  });

  it('LOGOUT clears auth and returns anonymous', () => {
    const state = authReducer(
      { status: 'authenticated', auth: storedAuth },
      { type: 'LOGOUT' },
    );

    expect(state).toEqual({ status: 'anonymous', auth: null });
  });
});
