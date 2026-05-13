import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// No emulador Android, localhost aponta para o próprio device — o host é 10.0.2.2
export const BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem('access_token');
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem('refresh_token');
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await AsyncStorage.multiSet([
    ['access_token', access],
    ['refresh_token', refresh],
  ]);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  authRequired = true
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (authRequired) {
    const token = await getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((json as { message?: string }).message ?? `Erro ${res.status}`);
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, auth = true) => request<T>('GET', path, undefined, auth),
  post: <T>(path: string, body: unknown, auth = true) => request<T>('POST', path, body, auth),
  patch: <T>(path: string, body: unknown, auth = true) => request<T>('PATCH', path, body, auth),
  delete: <T>(path: string, auth = true) => request<T>('DELETE', path, undefined, auth),
};
