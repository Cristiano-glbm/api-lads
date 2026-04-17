import Svg, { Path } from 'react-native-svg';

export interface ForumPostChevronVector16Props {
  color?: string;
}

/**
 * Chevron do post — layer `Icon` (16×16) > `Vector` no Figma:
 * path 8×4, posição (4, 6), stroke #99A1AF, weight 1,33, caps/joins arredondados.
 */
export function ForumPostChevronVector16({ color = '#99A1AF' }: ForumPostChevronVector16Props) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M4 6L8 10L12 6"
        stroke={color}
        strokeWidth={1.33}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
