import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

interface RequireRoleProps {
  role: string;
  children: ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { isAuthenticated, roles } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  const hasRole = roles.some((r) => r.toLowerCase() === role.toLowerCase());

  if (!hasRole) {
    // If the user is not allowed, don't expose the page.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
