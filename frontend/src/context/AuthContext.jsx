import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService.js';
import { getApiError, TOKEN_KEY } from '../utils/auth.js';
import { AuthContext } from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [authError, setAuthError] = useState('');

  const persistSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setAuthError('');
    return data.user;
  }, []);

  const login = useCallback(
    async (payload) => {
      try {
        setAuthError('');
        const data = await loginUser(payload);
        return persistSession(data);
      } catch (error) {
        const message = getApiError(error, 'Unable to login');
        setAuthError(message);
        throw new Error(message);
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      try {
        setAuthError('');
        const data = await registerUser(payload);
        return persistSession(data);
      } catch (error) {
        const message = getApiError(error, 'Unable to create account');
        setAuthError(message);
        throw new Error(message);
      }
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setAuthError('');
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function restoreSession() {
      try {
        const data = await getCurrentUser();
        if (isMounted) setUser(data.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      authError,
      login,
      register,
      logout
    }),
    [authError, isLoading, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
