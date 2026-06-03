import { api } from './api';

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  meta?: Record<string, unknown>;
  createdAt: string;
}

interface NotificationsResponse {
  success: boolean;
  data: ApiNotification[];
  pagination?: unknown;
  unreadCount?: number;
}

interface UnreadCountResponse {
  success: boolean;
  data: { count: number };
}

export async function listNotifications(): Promise<ApiNotification[]> {
  const res = await api.get<NotificationsResponse>('/api/notifications');
  return Array.isArray(res.data) ? res.data : [];
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get<UnreadCountResponse>('/api/notifications/unread-count');
  return res.data.count;
}

export async function markRead(id: string): Promise<void> {
  await api.patch(`/api/notifications/${id}/read`, {});
}

export async function markAllRead(): Promise<void> {
  await api.post('/api/notifications/read-all', {});
}

export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`/api/notifications/${id}`);
}

export async function deleteAllNotifications(): Promise<void> {
  await api.delete('/api/notifications');
}
