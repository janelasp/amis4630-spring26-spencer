import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import styles from './AuthStatus.module.css';

export function AuthStatus() {
  const { isAdmin, isAuthenticated, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!isAuthenticated) {
    const from = location.pathname + location.search;

    return (
      <nav className={styles.authNav} aria-label="Authentication navigation">
        <Link
          to="/login"
          state={{ from }}
          className={styles.link}
          aria-label="Go to login"
        >
          Login
        </Link>
        <Link
          to="/register"
          state={{ from }}
          className={styles.link}
          aria-label="Go to registration"
        >
          Register
        </Link>
      </nav>
    );
  }

  return (
    <nav className={styles.authNav} aria-label="Authenticated navigation">
      <Link to="/orders" className={styles.link} aria-label="View my orders">
        My Orders
      </Link>
      {isAdmin ? (
        <Link to="/admin" className={styles.link} aria-label="Go to admin dashboard">
          Admin
        </Link>
      ) : null}
      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
        aria-label="Logout"
      >
        Logout
      </button>
    </nav>
  );
}
