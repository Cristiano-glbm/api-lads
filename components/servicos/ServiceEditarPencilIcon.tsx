import Svg, { Path } from 'react-native-svg';

export interface ServiceEditarPencilIconProps {
  color?: string;
  size?: number;
}

/** Lápis “Editar” — traço estilo Lucide (alinhado ao olho e ao balão de contatar). */
const PENCIL_BODY =
  'M21.174 6.812a1 1 0 0 0-3.986-3.986L3.842 16.174a2 2 0 0 0-.5.83l-1.286 4.57a1 1 0 0 0 1.23 1.23l4.57-1.286a2 2 0 0 0 .83-.5L21.174 6.812Z';
const PENCIL_MARK = 'M15 5l4 4';

export function ServiceEditarPencilIcon({
  color = '#1E2939',
  size = 15,
}: ServiceEditarPencilIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={PENCIL_BODY}
        stroke={color}
        strokeWidth={1.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={PENCIL_MARK}
        stroke={color}
        strokeWidth={1.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
