import Svg, { Path } from 'react-native-svg';

/** Curva 5×3 — detalhe do ícone “enviar” (Inspect Figma: stroke #FFF, 1.667) */
export interface PaperPlaneTrailCurveProps {
  color?: string;
}

export function PaperPlaneTrailCurve({ color = '#FFFFFF' }: PaperPlaneTrailCurveProps) {
  return (
    <Svg width={5} height={3} viewBox="0 0 5 3" fill="none">
      <Path
        d="M0.833466 0.833496C0.979752 1.08684 1.19015 1.29722 1.4435 1.44349C1.69686 1.58975 1.98425 1.66676 2.2768 1.66676C2.56935 1.66676 2.85674 1.58975 3.1101 1.44349C3.36345 1.29722 3.57385 1.08684 3.72013 0.833496"
        stroke={color}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
