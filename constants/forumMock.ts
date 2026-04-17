import type { ForumCategory, ForumPinnedPost, ForumPost } from '@/types/forum';

/** Cabeçalho da tela do fórum (evento + título da área) */
export const FORUM_HOME_HEADER = {
  screenTitle: 'Noite Sem Pijama - Fórum',
  eventName: 'Noite Sem Pijama',
  eventEmoji: '🌙',
  dateLabel: '15/03/2026',
  subscribers: 234,
} as const;

export const FORUM_PINNED: ForumPinnedPost = {
  /** Só o texto; o sol do Figma vem de `assets/images/forum-pinned-sol.png` no card fixado */
  title: 'Dicas para Madrugada',
  author: 'João Silva',
  likes: 34,
  comments: 12,
};

export const FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'Qual linguagem usar na madrugada?',
    author: 'Maria Santos',
    likes: 18,
    comments: 9,
    tag: 'Técnico',
    icon: 'bulb',
  },
  {
    id: '2',
    title: 'Alguém para formar equipe?',
    author: 'Carlos Dev',
    likes: 42,
    comments: 15,
    tag: 'Networking',
    icon: 'handshake',
  },
  {
    id: '3',
    title: 'Horário de check-in confirmado?',
    author: 'Fernanda R.',
    likes: 7,
    comments: 3,
    tag: 'Dúvidas',
    icon: 'question',
  },
];

export const FORUM_FILTERS: ForumCategory[] = ['Geral', 'Técnico', 'Networking', 'Dúvidas'];
