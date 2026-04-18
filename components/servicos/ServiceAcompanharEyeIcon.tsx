import Svg, { Circle, Path } from 'react-native-svg';

export type ServiceAcompanharEyeVariant = 'onBrand' | 'onMuted';

export interface ServiceAcompanharEyeIconProps {
  color?: string;
  size?: number;
  /**
   * `onBrand` — “Acompanhar” (fundo roxo): traço mais forte.
   * `onMuted` — “Detalhes” (fundo claro): traço mais leve.
   */
  variant?: ServiceAcompanharEyeVariant;
}

/** Contorno do olho (curvas suaves, estilo Lucide — mais refinado que o path em “S”). */
const EYE_ALMOND_PATH =
  'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0Z';

/**
 * Olho “ver / acompanhar / detalhes” — forma mais suave + proporções por contexto.
 */
export function ServiceAcompanharEyeIcon({
  color = '#FFFFFF',
  size = 16,
  variant = 'onMuted',
}: ServiceAcompanharEyeIconProps) {
  const isBrand = variant === 'onBrand';
  const almondStroke = isBrand ? 2 : 1.6;
  const pupilR = isBrand ? 3 : 2.5;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={EYE_ALMOND_PATH}
        stroke={color}
        strokeWidth={almondStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={pupilR} fill={color} />
    </Svg>
  );
}
