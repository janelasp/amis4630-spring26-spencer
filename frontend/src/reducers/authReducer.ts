import type { AuthAction, AuthState } from '../types/auth';

export const initialAuthState: AuthState = {
  status: 'anonymous',
  auth: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_AUTH': {
      const { auth } = action.payload;
      return auth
        ? { ...state, status: 'authenticated', auth }
        : { ...state, status: 'anonymous', auth: null };
    }

    case 'LOGIN_SUCCESS': {
      return {
        ...state,
        status: 'authenticated',
        auth: action.payload.auth,
      };
    }

    case 'LOGOUT': {
      return { ...state, status: 'anonymous', auth: null };
    }
  }
}
