import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../services/apiClient';
import { useAuthContext } from '../../contexts/AuthContext';
import styles from './RegisterPage.module.css';

interface LocationState {
  from?: string;
}

export function RegisterPage() {
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const state = location.state as LocationState | null;
    return state?.from && typeof state.from === 'string' ? state.from : '/';
  }, [location.state]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.page} aria-label="Registration page">
      <h2 className={styles.heading}>Register</h2>

      {error && (
        <p className={styles.error} role="alert" aria-label="Registration error">
          {error}
        </p>
      )}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        aria-label="Registration form"
      >
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
            autoComplete="new-password"
            aria-label="Password"
          />
        </label>

        <label className={styles.label}>
          Confirm password
          <input
            className={styles.input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="Confirm password"
          />
        </label>

        <button
          type="submit"
          className={styles.submit}
          disabled={isLoading}
          aria-label="Submit registration"
        >
          {isLoading ? 'Creating account…' : 'Register'}
        </button>
      </form>

      <p className={styles.footer}>
        Already have an account?{' '}
        <Link to="/login" state={{ from }} aria-label="Go to login">
          Login
        </Link>
      </p>
    </section>
  );
}
