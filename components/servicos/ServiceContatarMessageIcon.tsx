import Svg, { Path } from 'react-native-svg';

/** Tom do ícone no Figma (secundário “Contatar”). */
const DEFAULT_CONTATAR_ICON = '#222D3E';

export interface ServiceContatarMessageIconProps {
  color?: string;
  size?: number;
}

/**
 * Balão com cauda no canto inferior esquerdo — alinhado ao ícone “message” do Figma.
 */
export function ServiceContatarMessageIcon({
  color = DEFAULT_CONTATAR_ICON,
  size = 16,
}: ServiceContatarMessageIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
