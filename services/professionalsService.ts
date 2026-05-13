import { api } from './api';

export interface ApiProfessional {
  id: string;
  userId: string;
  headline: string;
  affiliation: string;
  rating: number;
  votes: number;
  website?: string;
  linkedin?: string;
  github?: string;
  memberSince: string;
  user: { id: string; name: string; email: string; avatarUrl?: string; role?: string };
  expertise?: { id: string; name: string }[];
  achievements?: { id: string; title: string }[];
  services?: unknown[];
}

interface ProfessionalsResponse {
  success: boolean;
  data: ApiProfessional[];
}

interface ProfessionalResponse {
  success: boolean;
  data: ApiProfessional;
}

export async function listProfessionals(): Promise<ApiProfessional[]> {
  const res = await api.get<ProfessionalsResponse>('/api/professionals', false);
  return res.data;
}

export async function getProfessional(id: string): Promise<ApiProfessional> {
  const res = await api.get<ProfessionalResponse>(`/api/professionals/${id}`);
  return res.data;
}
