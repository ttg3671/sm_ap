import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (token, email) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userEmail');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout
  };
};
