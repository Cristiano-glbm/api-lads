import Svg, { G, Path } from 'react-native-svg';

/**
 * Seta voltar — ForumHome Figma (slot 20×20).
 * Chevron 8×14 @ ~4.17,4.17 | traço horizontal 14×2 @ ~4.17,10 (stroke 1.66667).
 */
export interface ForumBackArrowIcon20Props {
  color?: string;
}

const CHEVRON_TX = 4.1667;
const CHEVRON_TY = 4.1667;

const LINE_TX = 4.1667;
/** Top 10px no frame 20 — origem do path em y ≈ 0.833 */
const LINE_TY = 10 - 0.833344;

export function ForumBackArrowIcon20({ color = '#FFFFFF' }: ForumBackArrowIcon20Props) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <G transform={[{ translateX: CHEVRON_TX }, { translateY: CHEVRON_TY }]}>
        <Path
          d="M6.66665 12.5L0.833313 6.66668L6.66665 0.833344"
          stroke={color}
          strokeWidth={1.66667}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <G transform={[{ translateX: LINE_TX }, { translateY: LINE_TY }]}>
        <Path
          d="M12.5 0.833344H0.833313"
          stroke={color}
          strokeWidth={1.66667}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
