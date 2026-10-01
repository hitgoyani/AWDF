import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('task_auth_token') || null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showInfo } = useToast();

  // Load user profile on mount if token exists
  useEffect(() => {
    let isMounted = true;

    const verifyExistingToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        if (isMounted && data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // Token invalid or expired
        if (isMounted) {
          localStorage.removeItem('task_auth_token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyExistingToken();

    // Listen for unauthorized events dispatched by api client
    const handleUnauthorized = (e) => {
      localStorage.removeItem('task_auth_token');
      setToken(null);
      setUser(null);
      showError(e.detail?.message || 'Session expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [token, showError]);

  // Login handler
  const login = useCallback(
    async (email, password) => {
      try {
        const data = await loginUser({ email, password });
        if (data.token) {
          localStorage.setItem('task_auth_token', data.token);
          setToken(data.token);
          setUser(data.user);
          showSuccess(`Welcome back, ${data.user.name || data.user.email}!`);
          return { success: true, user: data.user };
        }
        throw new Error(data.message || 'Login failed');
      } catch (err) {
        showError(err.message || 'Login failed');
        throw err;
      }
    },
    [showSuccess, showError]
  );

  // Register handler
  const register = useCallback(
    async (name, email, password) => {
      try {
        const data = await registerUser({ name, email, password });
        if (data.token) {
          localStorage.setItem('task_auth_token', data.token);
          setToken(data.token);
          setUser(data.user);
          showSuccess(`Registration successful! Welcome, ${data.user.name}!`);
          return { success: true, user: data.user };
        }
        throw new Error(data.message || 'Registration failed');
      } catch (err) {
        showError(err.message || 'Registration failed');
        throw err;
      }
    },
    [showSuccess, showError]
  );

  // Logout handler (Practical 7 Supplementary Problem)
  const logout = useCallback(() => {
    localStorage.removeItem('task_auth_token');
    setToken(null);
    setUser(null);
    showInfo('You have logged out.');
  }, [showInfo]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
