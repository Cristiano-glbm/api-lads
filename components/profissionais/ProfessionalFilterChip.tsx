import { Platform, Pressable, Text } from 'react-native';

/** Inspect Figma (chips “Todos”, “Web”, “DevOps”…): pílula, borda interna ~1,067px #E5E7EB */
const BORDER_W = 16 / 15;
const BORDER_IDLE = '#E5E7EB';
const INK_IDLE = '#4A5565';
const ACTIVE_BG = '#4F39F6';

/**
 * Padding assimétrico do Figma (ex.: Web / Mobile):
 * top ~8,13 | bottom 6 | left ~12–13 | right ~11–12,7 — média estável para não “partir” o texto.
 */
const PAD = {
  paddingTop: 8 + 2 / 15,
  paddingBottom: 6,
  paddingLeft: 12.07,
  paddingRight: 12.4,
} as const;

const LABEL = {
  fontFamily: 'Inter_500Medium',
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: 0,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
} as const;

export interface ProfessionalFilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function ProfessionalFilterChip({ label, active, onPress }: ProfessionalFilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
      onPress={onPress}
      style={({ pressed }) => ({
        flexShrink: 0,
        alignSelf: 'flex-start',
        borderRadius: 9999,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 8 + 2 / 15 + 6 + 16,
        borderWidth: BORDER_W,
        borderColor: active ? ACTIVE_BG : BORDER_IDLE,
        backgroundColor: active ? ACTIVE_BG : '#FFFFFF',
        opacity: pressed ? 0.92 : 1,
        ...PAD,
      })}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...LABEL, color: active ? '#FFFFFF' : INK_IDLE }}>
        {label}
      </Text>
    </Pressable>
  );
}
