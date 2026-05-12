import { useState, useEffect } from 'react';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('sgi_token');
    const storedUser = localStorage.getItem('sgi_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('sgi_token', newToken);
    localStorage.setItem('sgi_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('sgi_token');
    localStorage.removeItem('sgi_user');
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
