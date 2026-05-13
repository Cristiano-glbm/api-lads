import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/services/api';
import type { AuthUser } from '@/services/authService';
import * as authService from '@/services/authService';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updated: AuthUser) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // On mount, restore session from storage
  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          const me = await authService.getMe();
          setUser(me);
        }
      } catch {
        await clearTokens();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'cadastro' || segments[0] === 'recuperar-senha';
    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/home');
    }
  }, [user, isLoading, segments]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);
    await setTokens(res.data.accessToken, res.data.refreshToken ?? '');
    setUser(res.data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authService.register(name, email, password);
    await setTokens(res.data.accessToken, res.data.refreshToken ?? '');
    setUser(res.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const refresh = await getRefreshToken();
      if (refresh) await authService.logout(refresh);
    } catch {
      // ignore logout errors
    } finally {
      await clearTokens();
      setUser(null);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await authService.forgotPassword(email);
  }, []);

  const updateUser = useCallback((updated: AuthUser) => {
    if (updated) setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, forgotPassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
