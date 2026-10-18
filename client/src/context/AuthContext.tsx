import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { request, ApiError } from '../api/client.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: any) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('bhojansetu_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('bhojansetu_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await request<{ success: boolean; user: User }>('/auth/me');
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('bhojansetu_user', JSON.stringify(data.user));
      }
    } catch {
      localStorage.removeItem('bhojansetu_token');
      localStorage.removeItem('bhojansetu_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const data = await request<{ success: boolean; token: string; user: User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    localStorage.setItem('bhojansetu_token', data.token);
    localStorage.setItem('bhojansetu_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: any): Promise<User> => {
    const data = await request<{ success: boolean; token: string; user: User }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    localStorage.setItem('bhojansetu_token', data.token);
    localStorage.setItem('bhojansetu_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('bhojansetu_token');
      localStorage.removeItem('bhojansetu_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
