"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await AuthAPI.validateToken();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthAPI.login(email, password);
      
      if (response.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        setUser(response.data.user);
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 