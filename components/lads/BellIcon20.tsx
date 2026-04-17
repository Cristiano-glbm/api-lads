import Svg, { G, Path } from 'react-native-svg';

/**
 * Sino — export Figma (slot 20×20, stroke 1.66667, caps/joins round).
 * Corpo: Inspect `~15×12.5`, `viewBox="0 0 17 15"`, `Left`/`Top` 7.5006 / 1.6666 no ícone 20×20.
 */
const BELL_BODY_PATH =
  'M1.05105 11.9384C0.94219 12.0577 0.870348 12.2061 0.844266 12.3655C0.818184 12.5249 0.838986 12.6884 0.904141 12.8362C0.969297 12.984 1.076 13.1097 1.21127 13.1979C1.34653 13.2862 1.50454 13.3333 1.66605 13.3334H14.9994C15.1609 13.3334 15.3189 13.2866 15.4543 13.1985C15.5896 13.1104 15.6965 12.9848 15.7618 12.8371C15.8271 12.6894 15.8481 12.5259 15.8223 12.3665C15.7964 12.2071 15.7247 12.0587 15.6161 11.9392C14.5077 10.7967 13.3327 9.58254 13.3327 5.83337C13.3327 4.50729 12.8059 3.23552 11.8683 2.29784C10.9306 1.36016 9.6588 0.833374 8.33272 0.833374C7.00664 0.833374 5.73487 1.36016 4.79719 2.29784C3.8595 3.23552 3.33272 4.50729 3.33272 5.83337C3.33272 9.58254 2.15689 10.7967 1.05105 11.9384Z';

const BELL_BODY_TX = 7.5006;
const BELL_BODY_TY = 1.6666;

/** Badalo: Inspect `~2.887×0.833`, `viewBox="0 0 5 3"` + `Left`/`Top` 8.5567 / 17.5 */
const CLAPPER_PATH =
  'M0.833466 0.833496C0.979752 1.08684 1.19015 1.29722 1.4435 1.44349C1.69686 1.58975 1.98425 1.66676 2.2768 1.66676C2.56935 1.66676 2.85674 1.58975 3.1101 1.44349C3.36345 1.29722 3.57385 1.08684 3.72013 0.833496';

const CLAPPER_TX = 8.55667 - 0.833466;
const CLAPPER_TY = 17.5 - 0.833496;

const STROKE = 1.66667 as const;

export interface BellIcon20Props {
  color?: string;
}

export function BellIcon20({ color = '#FFFFFF' }: BellIcon20Props) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <G transform={[{ translateX: BELL_BODY_TX }, { translateY: BELL_BODY_TY }]}>
        <Path
          d={BELL_BODY_PATH}
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <G transform={[{ translateX: CLAPPER_TX }, { translateY: CLAPPER_TY }]}>
        <Path
          d={CLAPPER_PATH}
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
