import type { ServiceCategoryId } from '@/types/service';

/** Ícones exportados do Figma (PNG); substituem emoji/FA quando existir entrada. */
export const CATEGORY_LEAD_IMAGES: Partial<Record<ServiceCategoryId, number>> = {
  web: require('../assets/images/category-laptop.png'),
  devops: require('../assets/images/category-devops-cloud.png'),
};
