import { Platform, Pressable, Text } from 'react-native';

export interface ForumFilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const FILTER_BORDER_W = 1.067;
/** Inspect Figma — chip ativo “Geral” */
const FILTER_ACTIVE_PAD_TOP = 8.133;
const FILTER_ACTIVE_PAD_RIGHT = 11.867;
const FILTER_ACTIVE_PAD_BOTTOM = 6;
const FILTER_ACTIVE_PAD_LEFT = 12.067;
/** Paddings inativos — Inspect varia por rótulo (auto-layout Figma) */
const INACTIVE_PAD = {
  /** “Técnico” */
  tecnico: { top: 8.133, right: 9.533, bottom: 6, left: 11.067 },
  /** “Networking” (frame Figma; app usa só “Networking”) */
  networking: { top: 8.133, right: 11, bottom: 6, left: 11.067 },
  /** “Dúvidas” */
  duvidas: { top: 8.133, right: 10.8, bottom: 6, left: 12.067 },
} as const;

function inactivePaddingForLabel(label: string): (typeof INACTIVE_PAD)['tecnico'] {
  switch (label) {
    case 'Técnico':
      return INACTIVE_PAD.tecnico;
    case 'Networking':
      return INACTIVE_PAD.networking;
    case 'Dúvidas':
      return INACTIVE_PAD.duvidas;
    case 'Geral':
      return INACTIVE_PAD.tecnico;
    default:
      return INACTIVE_PAD.networking;
  }
}

const FILTER_ACTIVE_BG = '#4F39F6';
const FILTER_ACTIVE_BORDER = '#4F39F6';
const FILTER_INACTIVE_BG = '#FFFFFF';
const FILTER_INACTIVE_BORDER = '#E5E7EB';
const FILTER_INACTIVE_TEXT = '#4A5565';
/** `border-radius` enorme no Figma = pílula */
const FILTER_PILL_RADIUS = 9999;

export function ForumFilterChip({ label, active, onPress }: ForumFilterChipProps) {
  const inactivePad = inactivePaddingForLabel(label);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Filtrar por ${label}`}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: FILTER_PILL_RADIUS,
        borderWidth: FILTER_BORDER_W,
        paddingTop: active ? FILTER_ACTIVE_PAD_TOP : inactivePad.top,
        paddingRight: active ? FILTER_ACTIVE_PAD_RIGHT : inactivePad.right,
        paddingBottom: active ? FILTER_ACTIVE_PAD_BOTTOM : inactivePad.bottom,
        paddingLeft: active ? FILTER_ACTIVE_PAD_LEFT : inactivePad.left,
        backgroundColor: active ? FILTER_ACTIVE_BG : FILTER_INACTIVE_BG,
        borderColor: active ? FILTER_ACTIVE_BORDER : FILTER_INACTIVE_BORDER,
      }}>
      <Text
        {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
        style={{
          color: active ? '#FFFFFF' : FILTER_INACTIVE_TEXT,
          fontFamily: 'Inter_600SemiBold',
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: '600',
          letterSpacing: 0,
          lineHeight: 20,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
