import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ApiError } from '../../services/apiClient';
import { LoginPage } from './LoginPage';

const mockLogin = vi.fn<
  (email: string, password: string) => Promise<void>
>();

vi.mock('../../contexts/AuthContext', () => {
  return {
    useAuthContext: () => ({
      login: mockLogin,
    }),
  };
});

describe('<LoginPage />', () => {
  it('shows an error message when submitting with empty fields', async () => {
    mockLogin.mockRejectedValueOnce(
      new ApiError('Email and password are required.', 400),
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    // Clicking the submit button can be blocked by native required-field validation.
    // Submitting the form directly ensures the onSubmit handler runs.
    fireEvent.submit(screen.getByRole('form', { name: /login form/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));
    expect(mockLogin).toHaveBeenCalledWith('', '');

    expect(
      await screen.findByRole('alert', { name: /login error/i }),
    ).toHaveTextContent('Email and password are required.');
  });
});
