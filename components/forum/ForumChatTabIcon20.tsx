import Svg, { G, Path } from 'react-native-svg';

const STROKE_INACTIVE = '#99A1AF';
const STROKE_PURPLE = '#4F39F6';
const STROKE_BLUE = '#2563EB';

/** Inspect Figma (Fórum): vetor 15×15 no Icon 20×20 — Left 2,5px, Top 2,5px */
const SLOT = 15;
const SLOT_OFF = 2.5;
/** Path exportado em viewBox 17×17; escala para caber no slot 15×15 */
const PATH_VB = 17;
const SCALE = SLOT / PATH_VB;
/** Mantém traço ~1,5px no ecrã após scale(15/17) */
const STROKE_USER = 1.5 / SCALE;

export interface ForumChatTabIcon20Props {
  active: boolean;
  accent?: 'purple' | 'blue';
}

export function ForumChatTabIcon20({ active, accent = 'purple' }: ForumChatTabIcon20Props) {
  const stroke = active ? (accent === 'blue' ? STROKE_BLUE : STROKE_PURPLE) : STROKE_INACTIVE;

  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <G transform={`translate(${SLOT_OFF}, ${SLOT_OFF}) scale(${SCALE})`}>
        <Path
          d="M15.75 10.75C15.75 11.192 15.5744 11.616 15.2618 11.9285C14.9493 12.2411 14.5254 12.4167 14.0833 12.4167H4.08333L0.75 15.75V2.41667C0.75 1.97464 0.925595 1.55072 1.23816 1.23816C1.55072 0.925595 1.97464 0.75 2.41667 0.75H14.0833C14.5254 0.75 14.9493 0.925595 15.2618 1.23816C15.5744 1.55072 15.75 1.97464 15.75 2.41667V10.75Z"
          stroke={stroke}
          strokeWidth={STROKE_USER}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}
