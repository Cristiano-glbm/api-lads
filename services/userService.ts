import { api } from './api';
import type { AuthUser } from './authService';

interface UserResponse {
  success: boolean;
  data: AuthUser;
}

interface StatsResponse {
  success: boolean;
  data: Record<string, unknown>;
}

export async function getUserById(id: string): Promise<AuthUser> {
  const res = await api.get<UserResponse>(`/api/users/${id}`);
  return res.data;
}

export async function updateProfile(data: { name?: string; bio?: string; avatarUrl?: string; institution?: string; course?: string }): Promise<AuthUser> {
  const res = await api.patch<UserResponse>('/api/users/me', data);
  return res.data;
}

export async function getMyStats(): Promise<Record<string, unknown>> {
  const res = await api.get<StatsResponse>('/api/users/me/stats');
  return res.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.patch('/api/users/me/password', { currentPassword, newPassword });
}

export interface UserSearchResult {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export async function searchUsers(q: string): Promise<UserSearchResult[]> {
  if (!q.trim()) return [];
  const res = await api.get<{ success: boolean; data: UserSearchResult[] }>(`/api/users/search?q=${encodeURIComponent(q)}`);
  return res.data;
}
