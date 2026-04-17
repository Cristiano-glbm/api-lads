import Svg, { Path } from 'react-native-svg';

/** Pasta preenchida (Material-style), monocromática — mesmo tom do texto #1E2939. */
const FOLDER_D =
  'M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2h-8l-2-2z';

export interface CategoriasFolderIconProps {
  size?: number;
  color?: string;
}

export function CategoriasFolderIcon({ size = 18, color = '#1E2939' }: CategoriasFolderIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityRole="image">
      <Path d={FOLDER_D} fill={color} />
    </Svg>
  );
}
