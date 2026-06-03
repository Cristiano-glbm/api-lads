export type ForumCategory = 'Geral' | 'Técnico' | 'Networking' | 'Dúvidas';

export type ForumPostIcon = 'bulb' | 'handshake' | 'question';

export interface ForumReply {
  id: string;
  author: string;
  authorId?: string;
  isLads?: boolean;
  text: string;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  /** Texto completo do post (exibido na tela de detalhe) */
  body?: string;
  /** URL/base64 de imagem anexada ao post */
  imageUrl?: string;
  /** Data/hora formatada, ex.: "17/08/2026  02:46" */
  date?: string;
  likes: number;
  liked?: boolean;
  comments: number;
  tag: ForumCategory;
  icon: ForumPostIcon;
  replies?: ForumReply[];
}

export interface ForumPinnedPost {
  title: string;
  author: string;
  likes: number;
  comments: number;
}
