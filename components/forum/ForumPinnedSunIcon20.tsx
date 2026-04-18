import { View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

/**
 * Sol 20×20 antes do título do post fixado — vetor nítido no mobile (substitui raster que
 * podia parecer estrela/emoji). Cores próximas ao alfinete Fixado (#FE9A00 / âmbar Figma).
 */
const RAY = {
  stroke: '#F59E0B',
  strokeWidth: 1.15,
  strokeLinecap: 'round' as const,
};

export function ForumPinnedSunIcon20() {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Sol"
      style={{ width: 20, height: 20, flexShrink: 0 }}>
      <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <Line x1={10} y1={1.75} x2={10} y2={5.35} {...RAY} />
        <Line x1={10} y1={14.65} x2={10} y2={18.25} {...RAY} />
        <Line x1={1.75} y1={10} x2={5.35} y2={10} {...RAY} />
        <Line x1={14.65} y1={10} x2={18.25} y2={10} {...RAY} />
        <Line x1={3.35} y1={3.35} x2={5.85} y2={5.85} {...RAY} />
        <Line x1={14.15} y1={14.15} x2={16.65} y2={16.65} {...RAY} />
        <Line x1={16.65} y1={3.35} x2={14.15} y2={5.85} {...RAY} />
        <Line x1={5.85} y1={14.15} x2={3.35} y2={16.65} {...RAY} />
        <Circle cx={10} cy={10} r={3.35} fill="#FDE047" stroke="#EA580C" strokeWidth={0.55} />
      </Svg>
    </View>
  );
}
