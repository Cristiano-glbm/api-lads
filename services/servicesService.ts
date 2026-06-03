import { api } from './api';

export interface ApiServiceCategory {
  id: string;
  title: string;
  icon?: string;
  colors?: unknown;
  emoji?: string;
  _count?: { services: number };
}

export interface ApiService {
  id: string;
  title: string;
  description?: string;
  price?: number;
  categoryId: string;
  category?: ApiServiceCategory;
}

export type ApiRequestStatus = 'ORCAMENTO' | 'PROGRESSO' | 'CONCLUIDO' | 'CANCELADO';

export interface ApiServiceRequest {
  id: string;
  title?: string;
  prazo?: string;
  status: ApiRequestStatus;
  createdAt: string;
  updatedAt: string;
  service?: ApiService;
}

interface CategoriesResponse {
  success: boolean;
  data: { categories: ApiServiceCategory[] };
}

interface ServicesResponse {
  success: boolean;
  data: { services: ApiService[] };
}

interface RequestsResponse {
  success: boolean;
  data: { requests: ApiServiceRequest[] };
}

interface RequestResponse {
  success: boolean;
  data: { request: ApiServiceRequest };
}

export async function listCategories(): Promise<ApiServiceCategory[]> {
  const res = await api.get<CategoriesResponse>('/api/services/categories', false);
  return res.data.categories;
}

export async function listServices(): Promise<ApiService[]> {
  const res = await api.get<ServicesResponse>('/api/services', false);
  return res.data.services;
}

export async function getMyRequests(): Promise<ApiServiceRequest[]> {
  const res = await api.get<RequestsResponse>('/api/services/requests');
  return res.data.requests;
}

export async function getRequest(id: string): Promise<ApiServiceRequest> {
  const res = await api.get<RequestResponse>(`/api/services/requests/${id}`);
  return res.data.request;
}

export async function createRequest(data: {
  serviceId?: string;
  title?: string;
  categoria?: string;
  descricao?: string;
  orcamento?: string;
  prazo?: string;
  anexoUri?: string;
}): Promise<ApiServiceRequest> {
  const { anexoUri, ...rest } = data;
  const payload = anexoUri ? { ...rest, meta: JSON.stringify({ anexoUri }) } : rest;
  const res = await api.post<RequestResponse>('/api/services/requests', payload);
  return res.data.request;
}

export async function updateRequestStatus(
  id: string,
  status: ApiRequestStatus
): Promise<ApiServiceRequest> {
  const res = await api.patch<RequestResponse>(`/api/services/requests/${id}`, { status });
  return res.data.request;
}

export async function cancelRequest(id: string): Promise<void> {
  await api.delete(`/api/services/requests/${id}`);
}
