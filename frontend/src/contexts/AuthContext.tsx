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
    const stored = loadStoredAuth();
    dispatch({ type: 'RESTORE_AUTH', payload: { auth: stored } });
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
