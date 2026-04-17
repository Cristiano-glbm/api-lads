export type ForumCategory = 'Geral' | 'Técnico' | 'Networking' | 'Dúvidas';

export type ForumPostIcon = 'bulb' | 'handshake' | 'question';

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
  tag: ForumCategory;
  icon: ForumPostIcon;
}

export interface ForumPinnedPost {
  title: string;
  author: string;
  likes: number;
  comments: number;
}
