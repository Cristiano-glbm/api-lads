export type ServiceCategoryId =
  | 'web'
  | 'mobile'
  | 'ia'
  | 'uiux'
  | 'devops'
  | 'consultoria';

export interface ServiceCategoryItem {
  id: ServiceCategoryId;
  title: string;
  countLabel: string;
  /** Nomes de ícone FontAwesome 4 (@expo/vector-icons) */
  icon: 'laptop' | 'mobile-phone' | 'cogs' | 'paint-brush' | 'cloud' | 'bar-chart';
  /** Fundo e borda do cartão (Inspect Figma por categoria) */
  surfaceColor: string;
  borderColor: string;
  iconColor: string;
  /** Se definido, substitui o ícone FontAwesome (ex.: 💻 com tipografia Inter 500 / 24 no Figma) */
  emoji?: string;
  /** Cor do emoji (ex. Web: `#1447E6`); senão usa `iconColor`. */
  emojiColor?: string;
}

export type ServiceRequestStatus = 'concluido' | 'progresso' | 'orcamento';

export interface ServiceRequestItem {
  id: string;
  title: string;
  status: ServiceRequestStatus;
  meta: string;
}
