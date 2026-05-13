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
  /** Só o texto; o sol antes do título é o componente `ForumPinnedSunIcon20` */
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
    date: '17/08/2026  02:46',
    body: 'Fala, galera!\n\nTô aqui virando a noite codando e bateu uma dúvida real 😄\n\nQual linguagem vocês acham melhor pra programar de madrugada? Tipo, algo que não seja tão cansativo mentalmente, mas que ainda renda bem. Tava pensando entre JavaScript e Python, mas não sei qual flui mais nesse horário.\n\nVocês têm alguma preferência ou experiência com isso? O que costuma funcionar melhor pra vocês nessas madrugadas?',
    likes: 18,
    comments: 8,
    tag: 'Técnico',
    icon: 'bulb',
    replies: [
      { id: 'r1a', author: 'João (LADS)', isLads: true, text: 'Recomendo Python pela simplicidade e velocidade de prototipagem. Tem muito mais tempo para dormir depois! 😄' },
      { id: 'r1b', author: 'Pedro', text: 'JavaScript também é ótimo, especialmente com Node.js. A comunidade de suporte é enorme!' },
    ],
  },
  {
    id: '2',
    title: 'Alguém para formar equipe?',
    author: 'Carlos Dev',
    date: '15/03/2026  21:10',
    body: 'Oi pessoal! Estou procurando pessoas para montar uma equipe para o hackathon. Tenho experiência em backend com Node.js e estou precisando de alguém de frontend e talvez design.\n\nSe tiver interesse, me manda mensagem no chat! A ideia é fazer algo focado em impacto social.',
    likes: 11,
    comments: 5,
    tag: 'Networking',
    icon: 'handshake',
    replies: [
      { id: 'r2a', author: 'Lucas (LADS)', isLads: true, text: 'Olá! Tenho experiência em React e Node. Pode me chamar pelo chat!' },
      { id: 'r2b', author: 'Ana', text: 'Procuro equipe também! Especialista em IA/ML. Vamos nos conectar?' },
    ],
  },
  {
    id: '3',
    title: 'Horário de check-in confirmado?',
    author: 'Fernanda R.',
    date: '15/03/2026  19:45',
    body: 'Boa noite! Alguém sabe confirmar o horário exato do check-in para o evento de hoje? Vi na descrição que começa às 22h, mas um colega me disse que pode ter mudado para 21h30.\n\nTambém queria saber se precisa levar algum documento específico além do RG.',
    likes: 6,
    comments: 3,
    tag: 'Dúvidas',
    icon: 'question',
    replies: [
      { id: 'r3a', author: 'Admin LADS', isLads: true, text: 'O check-in começa às 22h no laboratório principal. Tragam documento com foto!' },
      { id: 'r3b', author: 'Fernanda R.', text: 'Obrigada! Estarei lá às 22h15 então.' },
    ],
  },
];

export const FORUM_FILTERS: ForumCategory[] = ['Geral', 'Técnico', 'Networking', 'Dúvidas'];
