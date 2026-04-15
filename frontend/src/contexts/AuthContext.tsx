import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { AuthState, StoredAuth } from '../types/auth';
import { authReducer, initialAuthState } from '../reducers/authReducer';
import * as authService from '../services/authService';
import { getJwtRoles, tokenHasRole } from '../services/jwt';
import { AUTH_LOGOUT_EVENT } from '../services/authEvents';
import {
  clearStoredAuth,
  loadStoredAuth,
  saveStoredAuth,
} from '../services/tokenStorage';

interface AuthContextValue {
  state: AuthState;
  isAuthenticated: boolean;
  accessToken: string | null;
  roles: string[];
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

function toStoredAuth(response: {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
}): StoredAuth {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    expiresAtUtc: response.expiresAtUtc,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    let isMounted = true;

    const isExpiredOrInvalid = (expiresAtUtc: string): boolean => {
      const expiresAtMs = Date.parse(expiresAtUtc);
      if (Number.isNaN(expiresAtMs)) {
        return true;
      }

      // Small clock-skew buffer to avoid edge-of-expiry 401s.
      const skewMs = 30_000;
      return expiresAtMs - skewMs <= Date.now();
    };

    const restore = async () => {
      const stored = loadStoredAuth();
      if (!stored) {
        dispatch({ type: 'RESTORE_AUTH', payload: { auth: null } });
        return;
      }

      if (!isExpiredOrInvalid(stored.expiresAtUtc)) {
        dispatch({ type: 'RESTORE_AUTH', payload: { auth: stored } });
        return;
      }

      try {
        const refreshed = await authService.refresh(stored.refreshToken);
        const nextStored = toStoredAuth(refreshed);
        saveStoredAuth(nextStored);
        if (isMounted) {
          dispatch({ type: 'RESTORE_AUTH', payload: { auth: nextStored } });
        }
      } catch {
        clearStoredAuth();
        if (isMounted) {
          dispatch({ type: 'RESTORE_AUTH', payload: { auth: null } });
        }
      }
    };

    void restore();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      clearStoredAuth();
      dispatch({ type: 'LOGOUT' });
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const stored = toStoredAuth(response);
    saveStoredAuth(stored);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { auth: stored } });
  };

  const register = async (email: string, password: string) => {
    const response = await authService.register({ email, password });
    const stored = toStoredAuth(response);
    saveStoredAuth(stored);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { auth: stored } });
  };

  const logout = () => {
    clearStoredAuth();
    dispatch({ type: 'LOGOUT' });
  };

  const value = useMemo<AuthContextValue>(() => {
    const accessToken = state.auth?.accessToken ?? null;
    const roles = accessToken ? getJwtRoles(accessToken) : [];
    const isAdmin = accessToken ? tokenHasRole(accessToken, 'Admin') : false;

    return {
      state,
      isAuthenticated: state.status === 'authenticated' && !!accessToken,
      accessToken,
      roles,
      isAdmin,
      login,
      register,
      logout,
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
