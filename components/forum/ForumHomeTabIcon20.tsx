import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const DOOR = '#99A1AF';
const OUTLINE_PURPLE = '#4F39F6';
const OUTLINE_BLUE = '#2563EB';
const INACTIVE = '#99A1AF';

/** Inspect Figma: vetor da porta — bbox ~5×7.5; export SVG 7×9 */
const DOOR_BOX = { left: 7.5, top: 10, width: 5, height: 7.5 } as const;

/** Inspect Figma: contorno da casa — export 17×18 (bbox ~15×15.833); Left 2,5px, Top 1,667px no Icon 20×20 */
const OUTLINE_W = 17;
const OUTLINE_H = 18;
const OUTLINE_LEFT = 2.5;
const OUTLINE_TOP = 5 / 3;

export interface ForumHomeTabIcon20Props {
  active: boolean;
  accent?: 'purple' | 'blue';
}

/** Inspect Figma: “Icon 20×20” — contorno + porta (sub-SVG 7×9) */
export function ForumHomeTabIcon20({ active, accent = 'purple' }: ForumHomeTabIcon20Props) {
  const outline = active ? (accent === 'blue' ? OUTLINE_BLUE : OUTLINE_PURPLE) : INACTIVE;
  const doorStroke = active ? DOOR : INACTIVE;

  return (
    <View style={{ width: 20, height: 20, position: 'relative' }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: OUTLINE_LEFT,
          top: OUTLINE_TOP,
          width: OUTLINE_W,
          height: OUTLINE_H,
        }}>
        <Svg width={OUTLINE_W} height={OUTLINE_H} viewBox="0 0 17 18" fill="none">
          <Path
            d="M0.75 7.41623C0.749942 7.17379 0.802778 6.93425 0.904823 6.71433C1.00687 6.49441 1.15566 6.2994 1.34083 6.1429L7.17417 1.14373C7.47499 0.88949 7.85613 0.75 8.25 0.75C8.64387 0.75 9.02501 0.88949 9.32583 1.14373L15.1592 6.1429C15.3443 6.2994 15.4931 6.49441 15.5952 6.71433C15.6972 6.93425 15.7501 7.17379 15.75 7.41623V14.9162C15.75 15.3583 15.5744 15.7822 15.2618 16.0947C14.9493 16.4073 14.5254 16.5829 14.0833 16.5829H2.41667C1.97464 16.5829 1.55072 16.4073 1.23816 16.0947C0.925595 15.7822 0.75 15.3583 0.75 14.9162V7.41623Z"
            stroke={outline}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: DOOR_BOX.left,
          top: DOOR_BOX.top,
          width: DOOR_BOX.width,
          height: DOOR_BOX.height,
        }}>
        <Svg width={DOOR_BOX.width} height={DOOR_BOX.height} viewBox="0 0 7 9" fill="none">
          <Path
            d="M5.75 8.25V1.58333C5.75 1.36232 5.6622 1.15036 5.50592 0.994078C5.34964 0.837798 5.13768 0.75 4.91667 0.75H1.58333C1.36232 0.75 1.15036 0.837798 0.994078 0.994078C0.837798 1.15036 0.75 1.36232 0.75 1.58333V8.25"
            stroke={doorStroke}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>
    </View>
  );
}
