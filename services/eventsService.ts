import { api } from './api';

export interface ApiEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  location?: string;
  emoji: string;
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
}

interface EventsResponse {
  success: boolean;
  data: { events: ApiEvent[] };
}

interface EventResponse {
  success: boolean;
  data: { event: ApiEvent };
}

interface SubscribedResponse {
  success: boolean;
  data: { subscribed: boolean };
}

export async function listEvents(upcoming?: boolean): Promise<ApiEvent[]> {
  const query = upcoming ? '?upcoming=true' : '';
  const res = await api.get<EventsResponse>(`/api/events${query}`);
  return res.data.events;
}

export async function getEvent(id: string): Promise<ApiEvent> {
  const res = await api.get<EventResponse>(`/api/events/${id}`);
  return res.data.event;
}

export async function isSubscribed(id: string): Promise<boolean> {
  const res = await api.get<SubscribedResponse>(`/api/events/${id}/subscribed`);
  return res.data.subscribed;
}

export async function subscribe(id: string): Promise<void> {
  await api.post(`/api/events/${id}/subscribe`, {});
}

export async function unsubscribe(id: string): Promise<void> {
  await api.delete(`/api/events/${id}/subscribe`);
}

interface MyEventsResponse {
  success: boolean;
  data: ApiEvent[];
}

export async function listMyEvents(): Promise<ApiEvent[]> {
  const res = await api.get<MyEventsResponse>('/api/users/me/events');
  return res.data;
}
