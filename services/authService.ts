import { api } from './api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  institution?: string;
  course?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: { user: AuthUser; accessToken: string; refreshToken?: string };
}

interface MeResponse {
  success: boolean;
  data: { user: AuthUser };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/login', { email, password }, false);
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/register', { name, email, password }, false);
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/api/auth/logout', { refreshToken });
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post('/api/auth/forgot-password', { email }, false);
}

export async function getMe(): Promise<AuthUser> {
  const res = await api.get<MeResponse>('/api/auth/me');
  return res.data.user;
}
