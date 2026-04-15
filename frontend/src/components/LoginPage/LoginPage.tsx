import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../services/apiClient';
import { useAuthContext } from '../../contexts/AuthContext';
import styles from './LoginPage.module.css';

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const state = location.state as LocationState | null;
    return state?.from && typeof state.from === 'string' ? state.from : '/';
  }, [location.state]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.page} aria-label="Login page">
      <h2 className={styles.heading}>Login</h2>

      {error && (
        <p className={styles.error} role="alert" aria-label="Login error">
          {error}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit} aria-label="Login form">
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="Email"
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            aria-label="Password"
          />
        </label>

        <button
          type="submit"
          className={styles.submit}
          disabled={isLoading}
          aria-label="Submit login"
        >
          {isLoading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p className={styles.footer}>
        Don’t have an account?{' '}
        <Link to="/register" state={{ from }} aria-label="Go to registration">
          Register
        </Link>
      </p>
    </section>
  );
}
