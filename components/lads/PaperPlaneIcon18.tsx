import Svg, { G, Path } from 'react-native-svg';

/**
 * Ícone “enviar” no botão SOLICITAR SERVIÇO — Figma “Icon 18×18”:
 * corpo no frame 17×17; linha de dobra no SVG 10×10 (stroke 1.5 #FFF).
 * A linha é composta no mesmo viewBox 18×18 com translate alinhado ao Inspect.
 */
const PLANE_BODY_PATH =
  'M10.1519 15.5164C10.1803 15.5874 10.2299 15.648 10.2938 15.69C10.3577 15.7321 10.433 15.7536 10.5095 15.7516C10.586 15.7496 10.66 15.7243 10.7217 15.6791C10.7834 15.6338 10.8298 15.5708 10.8546 15.4984L15.7296 1.24837C15.7536 1.18192 15.7582 1.11 15.7428 1.04104C15.7274 0.972076 15.6927 0.908918 15.6428 0.858956C15.5928 0.808994 15.5297 0.774295 15.4607 0.758917C15.3917 0.743539 15.3198 0.74812 15.2534 0.772123L1.00335 5.64712C0.930976 5.67194 0.867923 5.71831 0.822658 5.78C0.777393 5.84169 0.752082 5.91575 0.750123 5.99224C0.748164 6.06873 0.76965 6.14399 0.811698 6.20792C0.853745 6.27184 0.914342 6.32138 0.985354 6.34987L6.93285 8.73487C7.12087 8.81015 7.29169 8.92272 7.43503 9.0658C7.57836 9.20887 7.69124 9.37949 7.76685 9.56737L10.1519 15.5164Z';

const PLANE_FOLD_PATH = 'M8.955 0.75L0.75 8.95425';

/** Alinha o path 10×10 ao segmento (16.3905, 1.61023)–(8.1855, 9.81448) no frame 18×18. */
const FOLD_TRANSLATE_X = 7.4355;
const FOLD_TRANSLATE_Y = 0.86023;

export interface PaperPlaneIcon18Props {
  color?: string;
}

export function PaperPlaneIcon18({ color = '#FFFFFF' }: PaperPlaneIcon18Props) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <G transform={[{ translateX: 0.5 }, { translateY: 0.5 }]}>
        <Path
          d={PLANE_BODY_PATH}
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <G transform={[{ translateX: FOLD_TRANSLATE_X }, { translateY: FOLD_TRANSLATE_Y }]}>
        <Path
          d={PLANE_FOLD_PATH}
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
