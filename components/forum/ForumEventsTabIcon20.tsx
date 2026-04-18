import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const STROKE_INACTIVE = '#949EAE';
const STROKE_PURPLE = '#4F39F6';
const STROKE_BLUE = '#2563EB';

export interface ForumEventsTabIcon20Props {
  active: boolean;
  accent?: 'purple' | 'blue';
}

/**
 * Calendário estilo Lucide — contorno, cantos arredondados, argolas no topo,
 * linha que separa o “cabeçalho” do corpo (viewBox 24×24 → 20×20).
 */
export function ForumEventsTabIcon20({ active, accent = 'purple' }: ForumEventsTabIcon20Props) {
  const stroke = active ? (accent === 'blue' ? STROKE_BLUE : STROKE_PURPLE) : STROKE_INACTIVE;

  return (
    <View
      style={{ width: 20, height: 20 }}
      accessibilityRole="image"
      accessibilityLabel="Eventos">
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M8 2v4"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 2v4"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Rect
          x={3}
          y={4}
          width={18}
          height={18}
          rx={2}
          ry={2}
          stroke={stroke}
          strokeWidth={2}
          fill="none"
        />
        <Path
          d="M3 10h18"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
