import type { ProfessionalListItem, ProfessionalProfile } from '@/types/professional';

export const PROFESSIONALS_LIST: ProfessionalListItem[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    role: 'Full Stack Developer',
    affiliation: 'LADS Coordinator',
    rating: 5,
    votes: 47,
    avatarUrl: 'https://i.pravatar.cc/200?img=12',
  },
  {
    id: '2',
    name: 'Fernanda Rodrigues',
    role: 'AI/ML Specialist',
    affiliation: 'LADS Member',
    rating: 5,
    votes: 32,
    avatarUrl: 'https://i.pravatar.cc/200?img=45',
  },
  {
    id: '3',
    name: 'Lucas Pereira',
    role: 'Mobile Developer',
    affiliation: 'LADS Member',
    rating: 4,
    votes: 28,
    avatarUrl: 'https://i.pravatar.cc/200?img=33',
  },
];

export const PROFESSIONAL_CARLOS: ProfessionalProfile = {
  id: '1',
  name: 'Carlos Oliveira',
  headline: 'Full Stack Developer',
  affiliation: 'Líder de Projetos - LADS',
  memberSince: 'Jan/2023',
  rating: 5,
  votes: 47,
  avatarUrl: 'https://i.pravatar.cc/400?img=12',
  expertise: [
    'Backend',
    'Frontend',
    'DevOps',
    'Python',
    'JavaScript',
    'Docker',
    'AWS',
    'PostgreSQL',
    'Django',
    'React',
  ],
  achievements: [
    'AWS Solutions Architect',
    'Vencedor Hackathon 2023',
    '10+ Projetos Entregues',
    'Mentor de 15 devs',
  ],
  contact: {
    website: 'site',
    linkedin: 'linkedin',
    github: 'github',
    email: 'email',
  },
};
