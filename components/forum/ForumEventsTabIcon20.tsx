import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const STROKE_INACTIVE = '#99A1AF';
const STROKE_PURPLE = '#4F39F6';
const STROKE_BLUE = '#2563EB';

/** Inspect Figma: espirais 2×5 — Left ~8,333 / ~13,333, Top ~1,667 (âncora viewBox 2×5) */
const BINDING_W = 2;
const BINDING_H = 5;
const BINDING_LEFT_X = 25 / 3 - 0.75;
const BINDING_RIGHT_X = 40 / 3 - 0.75;
const BINDING_TOP_Y = 5 / 3 - 0.75;

/** Inspect Figma: linha divisória do calendário — export 17×2, bbox ~15×0 */
const DIVIDER_W = 17;
const DIVIDER_H = 2;
const DIVIDER_LEFT = 2.5 - 0.75;
const DIVIDER_TOP = 8.33325 - 0.75;

export interface ForumEventsTabIcon20Props {
  active: boolean;
  accent?: 'purple' | 'blue';
}

function CalendarBindingMark({ stroke }: { stroke: string }) {
  return (
    <Svg width={BINDING_W} height={BINDING_H} viewBox="0 0 2 5" fill="none">
      <Path
        d="M0.75 0.75V4.08333"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function CalendarDividerRow({ stroke }: { stroke: string }) {
  return (
    <Svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 17 2" fill="none">
      <Path
        d="M0.75 0.75H15.75"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Inspect Figma: “Icon 20×20” — calendário (espirais 2×5 + corpo 20×20) */
export function ForumEventsTabIcon20({ active, accent = 'purple' }: ForumEventsTabIcon20Props) {
  const stroke = active ? (accent === 'blue' ? STROKE_BLUE : STROKE_PURPLE) : STROKE_INACTIVE;

  return (
    <View style={{ width: 20, height: 20, position: 'relative' }}>
      <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <Path
          d="M15.8333 3.33325H4.16667C3.24619 3.33325 2.5 4.07944 2.5 4.99992V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99992C17.5 4.07944 16.7538 3.33325 15.8333 3.33325Z"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: BINDING_LEFT_X,
          top: BINDING_TOP_Y,
          width: BINDING_W,
          height: BINDING_H,
        }}>
        <CalendarBindingMark stroke={stroke} />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: BINDING_RIGHT_X,
          top: BINDING_TOP_Y,
          width: BINDING_W,
          height: BINDING_H,
        }}>
        <CalendarBindingMark stroke={stroke} />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: DIVIDER_LEFT,
          top: DIVIDER_TOP,
          width: DIVIDER_W,
          height: DIVIDER_H,
        }}>
        <CalendarDividerRow stroke={stroke} />
      </View>
    </View>
  );
}
