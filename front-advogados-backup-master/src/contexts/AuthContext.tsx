
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken as storeToken, removeToken, getUserData, setUserData as storeUserData, removeUserData } from '@/lib/auth';

type UserRole = 'USUARIO' | 'ADVOGADO';

interface User {
  name: string;
  email: string;
  role: UserRole;
  oab?: string; 
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      const storedUser = getUserData();
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = useCallback((newToken: string, userData: User) => {
    storeToken(newToken);
    storeUserData(userData);
    setToken(newToken);
    setUser(userData);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    removeToken();
    removeUserData();
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        const updatedUser = { ...prevUser, ...userData };
        storeUserData(updatedUser); // Make sure to update localStorage as well
        return updatedUser;
      }
      return null;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
