import type { ServiceCategoryItem, ServiceRequestItem } from '@/types/service';

export const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  {
    id: 'web',
    title: 'Desenvolvimento Web',
    countLabel: '14 serviços',
    icon: 'laptop',
    surfaceColor: '#EFF6FF',
    borderColor: '#BEDBFF',
    /** FontAwesome: mesma cor em todas as plataformas (emoji 💻 varia por OS). */
    iconColor: '#1447E6',
  },
  {
    id: 'mobile',
    title: 'Mobile',
    countLabel: '8 serviços',
    icon: 'mobile-phone',
    surfaceColor: '#F0FDF4',
    borderColor: '#B9F8CF',
    iconColor: '#16A34A',
    /** Figma: Inter 500, 24/32, `#008236`, center — emoji consistente (FA “phone” não replica o raster). */
    emoji: '📱',
    emojiColor: '#008236',
  },
  {
    id: 'ia',
    title: 'IA/ML',
    countLabel: '6 serviços',
    icon: 'cogs',
    surfaceColor: '#FAF5FF',
    borderColor: '#E9D4FF',
    iconColor: '#7C3AED',
    /** Figma: Inter 500, 24/32, `#8200DB`, center — emoji 🤖 (ícone FA não replica o raster). */
    emoji: '🤖',
    emojiColor: '#8200DB',
  },
  {
    id: 'uiux',
    title: 'UI/UX',
    countLabel: '5 serviços',
    icon: 'paint-brush',
    surfaceColor: '#FDF2F8',
    borderColor: '#FCCEE8',
    iconColor: '#DB2777',
  },
  {
    id: 'devops',
    title: 'DevOps',
    countLabel: '7 serviços',
    icon: 'cloud',
    surfaceColor: '#ECFEFF',
    borderColor: '#A5F3FC',
    iconColor: '#0891B2',
  },
  {
    id: 'consultoria',
    title: 'Consultoria',
    countLabel: '10 serviços',
    icon: 'bar-chart',
    surfaceColor: '#FFFBEB',
    borderColor: '#FDE68A',
    iconColor: '#D97706',
  },
];

export const SERVICE_REQUESTS: ServiceRequestItem[] = [
  {
    id: '1',
    title: 'Sistema Web',
    status: 'concluido',
    meta: 'Entregue: 25/02/2026',
  },
  {
    id: '2',
    title: 'App Mobile',
    status: 'progresso',
    meta: 'Prazo: 15/03/2026',
  },
  {
    id: '3',
    title: 'Consultoria',
    status: 'orcamento',
    meta: 'Aguardando resposta...',
  },
];
