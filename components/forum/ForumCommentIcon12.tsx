import { Image } from 'react-native';

import { bundledImageSource } from '@/utils/bundledImageSource';

export interface ForumCommentIcon12Props {
  /** Reservado; o PNG já traz a cor do Figma */
  color?: string;
}

/** Comentário na linha de métricas — PNG do `Icon` 11×11 exportado do Figma */
const FORUM_COMMENT = bundledImageSource(
  require('../../assets/images/forum-stat-comment-11.png'),
);

export function ForumCommentIcon12(_props: ForumCommentIcon12Props) {
  return (
    <Image source={FORUM_COMMENT} style={{ width: 11, height: 11 }} resizeMode="contain" />
  );
}
