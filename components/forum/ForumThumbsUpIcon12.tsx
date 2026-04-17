import { Image } from 'react-native';

import { bundledImageSource } from '@/utils/bundledImageSource';

export interface ForumThumbsUpIcon12Props {
  /** Reservado; o asset PNG já traz a cor do Figma (#6A72B2 / traço) */
  color?: string;
}

/** Like na linha de métricas — PNG do `Icon` 11×11 exportado do Figma (lista de posts) */
const FORUM_THUMBS_UP = bundledImageSource(
  require('../../assets/images/forum-stat-thumbs-up-11.png'),
);

export function ForumThumbsUpIcon12(_props: ForumThumbsUpIcon12Props) {
  return (
    <Image source={FORUM_THUMBS_UP} style={{ width: 11, height: 11 }} resizeMode="contain" />
  );
}
