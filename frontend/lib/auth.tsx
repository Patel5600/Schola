'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from './api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'hod' | 'admin';
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role?: string; departmentId?: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (token) {
        try {
          // Try to restore user from localStorage first for faster initial load
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (e) {
              // Invalid stored user data, ignore
            }
          }
          
          // Verify token and get fresh user data from server
          const response = await authAPI.getMe();
          const { user: userData } = response.data;
          setUser(userData);
          
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
          // Token is invalid or expired, clear everything
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        // No token, clear any stale user data
        localStorage.removeItem('user');
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, accessToken, refreshToken } = response.data;

      // TODO: If using httpOnly cookies, remove localStorage and set withCredentials: true in api.ts
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      // Store user data for faster restoration on refresh
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      toast.success('Logged in successfully');
      // Redirect will be handled by the component
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const register = async (data: { email: string; password: string; name: string; role?: string; departmentId?: string }) => {
    try {
      await authAPI.register(data);
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
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

