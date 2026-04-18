import { View } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';

/** Inativo — cinza-azulado do Figma / referência (~#8A96A8–#9DA8B6) */
const STROKE_INACTIVE = '#949EAE';
const STROKE_PURPLE = '#4F39F6';
const STROKE_BLUE = '#2563EB';

export interface ForumHomeTabIcon20Props {
  active: boolean;
  accent?: 'purple' | 'blue';
}

/**
 * Ícone “Início” — mesmo desenho que Lucide/Feather (casa em contorno + porta),
 * viewBox 24×24 escalado para 20×20, stroke 2, linecap/linejoin arredondados.
 */
export function ForumHomeTabIcon20({ active, accent = 'purple' }: ForumHomeTabIcon20Props) {
  const stroke = active ? (accent === 'blue' ? STROKE_BLUE : STROKE_PURPLE) : STROKE_INACTIVE;

  return (
    <View
      style={{ width: 20, height: 20 }}
      accessibilityRole="image"
      accessibilityLabel="Início">
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Polyline
          points="9,22 9,12 15,12 15,22"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}
