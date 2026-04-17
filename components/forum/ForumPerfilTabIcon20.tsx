import Svg, { G, Path } from 'react-native-svg';

const STROKE_INACTIVE = '#99A1AF';
const STROKE_PURPLE = '#4F39F6';
const STROKE_BLUE = '#2563EB';

/** Inspect Figma (Vector ombros no Icon 20×20): Left 1,6667px, Top 12,5px — SVG 14×7 */
const SHOULDER_LEFT = 5 / 3;
const SHOULDER_TOP = 12.5;
const SHOULDER_D =
  'M12.4167 5.75V4.08333C12.4167 3.19928 12.0655 2.35143 11.4404 1.72631C10.8152 1.10119 9.96739 0.75 9.08333 0.75H4.08333C3.19928 0.75 2.35143 1.10119 1.72631 1.72631C1.10119 2.35143 0.75 3.19928 0.75 4.08333V5.75';

/** Inspect Figma (Vector cabeça no Icon 20×20): Left 4,1667px, Top 2,5px */
const HEAD_LEFT = 25 / 6;
const HEAD_TOP = 2.5;

const HEAD_D =
  'M4.08333 7.41667C5.92428 7.41667 7.41667 5.92428 7.41667 4.08333C7.41667 2.24238 5.92428 0.75 4.08333 0.75C2.24238 0.75 0.75 2.24238 0.75 4.08333C0.75 5.92428 2.24238 7.41667 4.08333 7.41667Z';

export interface ForumPerfilTabIcon20Props {
  active: boolean;
  accent?: 'purple' | 'blue';
}

export function ForumPerfilTabIcon20({ active, accent = 'purple' }: ForumPerfilTabIcon20Props) {
  const stroke = active ? (accent === 'blue' ? STROKE_BLUE : STROKE_PURPLE) : STROKE_INACTIVE;
  const common = {
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <G transform={`translate(${SHOULDER_LEFT}, ${SHOULDER_TOP})`}>
        <Path d={SHOULDER_D} {...common} />
      </G>
      <G transform={`translate(${HEAD_LEFT}, ${HEAD_TOP})`}>
        <Path d={HEAD_D} {...common} />
      </G>
    </Svg>
  );
}
