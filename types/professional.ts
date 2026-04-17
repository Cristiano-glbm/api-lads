export type ProfessionalFilterId = 'todos' | 'ia' | 'web' | 'mobile' | 'devops' | 'design';

export interface ProfessionalListItem {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  rating: number;
  votes: number;
  avatarUrl: string;
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  headline: string;
  affiliation: string;
  memberSince: string;
  rating: number;
  votes: number;
  avatarUrl: string;
  expertise: string[];
  achievements: string[];
  contact: {
    website: string;
    linkedin: string;
    github: string;
    email: string;
  };
}
