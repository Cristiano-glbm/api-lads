import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Platform, Pressable, Text, View } from 'react-native';

export interface LadsTopBarProps {
  /** Cor do “L” dentro do quadrado branco */
  logoTint?: string;
  onPressBell?: () => void;
  /** Figma Meu Perfil: engrenagem 20×20 #FFF, ~6px de padding (alvo 32×32) */
  onPressSettings?: () => void;
  /**
   * Inspect Figma (Serviços): 448×56, padding horizontal 16px, `justify-content: space-between`,
   * fundo #432DD7, sombras duplas no header.
   * `perfil-figma`: fundo transparente + sino (gradiente no ecrã).
   * `meu-perfil-figma`: LADS + “Meu Perfil” + engrenagem (gradiente no ecrã).
   */
  variant?: 'default' | 'servicos-figma' | 'perfil-figma' | 'meu-perfil-figma';
}

const FIGMA_BAR_BG = '#432DD7';
const BAR_MAX_WIDTH = 448;
const BAR_HORIZONTAL_PAD = 16;

/** Inspect Figma: “L” no logo — Inter 700, 14px, line-height 20, #432DD7 */
const LOGO_L_TYPO = {
  fontFamily: 'Inter_700Bold',
  fontSize: 14,
  lineHeight: 20,
  fontStyle: 'normal' as const,
  color: '#432DD7',
};

/**
 * Inspect Figma (texto “LADS” no header Serviços):
 * `color: #FFF; font-family: Inter; font-size: 14px; font-style: normal; font-weight: 700;
 * line-height: 20px; letter-spacing: 1.4px;` — em RN: face `Inter_700Bold` (= Inter 700).
 */
const LADS_WORDMARK = {
  fontFamily: 'Inter_700Bold',
  fontSize: 14,
  lineHeight: 20,
  fontStyle: 'normal' as const,
  color: '#FFF',
  letterSpacing: 1.4,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
};
/** Inspect Figma (Dev Mode): `0 2px 2px -1px` e `0 3px 3px -1px`, #000 10% */
const FIGMA_BAR_SHADOW_WEB = {
  boxShadow: '0 2px 2px -1px rgba(0, 0, 0, 0.1), 0 3px 3px -1px rgba(0, 0, 0, 0.1)',
} as const;

const FIGMA_BAR_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 4,
} as const;

/**
 * Inspect Figma (Container do “L”):
 * `display: flex; width: 32px; height: 32px; padding-right: 0; justify-content: center; align-items: center;
 * flex-shrink: 0; border-radius: 10px; background: #FFF;`
 */
const LOGO_L_SHELL_BASE = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  width: 32,
  height: 32,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  flexShrink: 0 as const,
  borderRadius: 10,
  backgroundColor: '#FFFFFF',
} as const;

/** Figma: `box-shadow: 0 1px 3px 0 rgba(0,0,0,.10), 0 1px 2px -1px rgba(0,0,0,.10)` */
const LOGO_L_SHELL_SHADOW_WEB = {
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
} as const;

const LOGO_L_SHELL_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
} as const;

const LOGO_L_SHELL_STYLE = [
  LOGO_L_SHELL_BASE,
  Platform.OS === 'web' ? LOGO_L_SHELL_SHADOW_WEB : LOGO_L_SHELL_SHADOW_NATIVE,
] as const;

/**
 * Inspect Figma (área do botão sino, Serviços): 32×32 com ~6px de “respiro” em volta do ícone 20×20;
 * ícone `#FFF` sobre o header `#432DD7` (sem chip branco por trás).
 */
const FIGMA_SERVICOS_BELL_HIT = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  width: 32,
  height: 32,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  flexShrink: 0 as const,
  position: 'relative' as const,
} as const;

/** Figma Meu Perfil: ícone engrenagem 20×20 com padding 6 → 32×32 */
const FIGMA_PERFIL_GEAR_HIT = {
  width: 32,
  height: 32,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  flexShrink: 0 as const,
} as const;

/**
 * Inspect Figma (Container logo + “LADS”):
 * `display: flex; width: 80.8px; height: 32px; align-items: center; gap: 8px;`
 */
const FIGMA_SERVICOS_LOGO_WORDMARK_ROW = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  width: 80.8,
  height: 32,
  alignItems: 'center' as const,
  gap: 8,
};

/**
 * Inspect Figma (Text “LADS” / container fill):
 * `display: flex; height: 20px; align-items: flex-start; flex: 1 0 0;`
 */
const LADS_WORDMARK_CONTAINER_SERVICOS = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  height: 20,
  alignItems: 'flex-start' as const,
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  minWidth: 0,
} as const;

/**
 * Inspect Figma (Container pai): `display: flex; height: 32px; align-items: center; flex: 1 0 0;`
 */
const FIGMA_SERVICOS_LEFT_CLUSTER = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  minWidth: 0,
  height: 32,
  alignItems: 'center' as const,
};

/**
 * Inspect Figma (badge no sino, topbar #432DD7 — Home / Eventos / Serviços):
 * 8×8, círculo, borda ~1.067px #432DD7, preenchimento `#FF8487`.
 */
const FIGMA_NOTIF_DOT = {
  width: 8,
  height: 8,
  borderRadius: 9999,
  borderWidth: 1.067,
  borderColor: '#432DD7',
  backgroundColor: '#FF8487',
} as const;

function BellNotificationDot({ right, top }: { right: number; top: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        right,
        top,
        ...FIGMA_NOTIF_DOT,
      }}
    />
  );
}

/** Sino Figma: PNG export 20×20 (`bell-topbar-figma.png`), alvo 32×32, ponto #FF8487 — reutilizável (ex.: Fórum). */
export function LadsTopBarBellButton({ onPress }: { onPress?: () => void }) {
  const router = useRouter();
  const handlePress = onPress ?? (() => router.push('/notificacoes'));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Notificações"
      hitSlop={12}
      onPress={handlePress}
      style={[FIGMA_SERVICOS_BELL_HIT, { zIndex: 21 }]}>
      <Image
        source={require('@/assets/images/bell-topbar-figma.png')}
        style={{ width: 20, height: 20 }}
        resizeMode="contain"
      />
      <BellNotificationDot right={4} top={4} />
    </Pressable>
  );
}

const MEU_PERFIL_SUB = {
  fontFamily: 'Inter_600SemiBold',
  fontSize: 12,
  lineHeight: 16,
  color: 'rgba(255,255,255,0.88)',
  marginTop: 2,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
} as const;

export function LadsTopBar({
  logoTint = '#5D3FD3',
  onPressBell,
  onPressSettings,
  variant = 'default',
}: LadsTopBarProps) {
  if (variant === 'meu-perfil-figma') {
    return (
      <View
        className="w-full flex-row items-center justify-between"
        style={{
          position: 'relative' as const,
          zIndex: 20,
          width: '100%',
          overflow: 'visible' as const,
          height: 56,
          maxWidth: BAR_MAX_WIDTH,
          alignSelf: 'center',
          paddingHorizontal: BAR_HORIZONTAL_PAD,
          backgroundColor: 'transparent',
        }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0, height: 56, paddingRight: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <View style={LOGO_L_SHELL_STYLE}>
              <Text style={LOGO_L_TYPO}>L</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
              <Text style={LADS_WORDMARK}>LADS</Text>
              <Text style={MEU_PERFIL_SUB} numberOfLines={1}>
                Meu Perfil
              </Text>
            </View>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Definições"
          hitSlop={8}
          onPress={onPressSettings}
          style={FIGMA_PERFIL_GEAR_HIT}>
          <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  }

  if (variant === 'servicos-figma' || variant === 'perfil-figma') {
    const barTransparent = variant === 'perfil-figma';
    return (
      <View
        className="w-full flex-row items-center justify-between"
        style={{
          position: 'relative' as const,
          zIndex: 20,
          width: '100%',
          overflow: 'visible' as const,
          height: 56,
          maxWidth: BAR_MAX_WIDTH,
          alignSelf: 'center',
          paddingHorizontal: BAR_HORIZONTAL_PAD,
          backgroundColor: barTransparent ? 'transparent' : FIGMA_BAR_BG,
          ...(barTransparent ? {} : Platform.OS === 'web' ? FIGMA_BAR_SHADOW_WEB : FIGMA_BAR_SHADOW_NATIVE),
        }}>
        <View style={FIGMA_SERVICOS_LEFT_CLUSTER}>
          <View style={FIGMA_SERVICOS_LOGO_WORDMARK_ROW}>
            <View style={LOGO_L_SHELL_STYLE}>
              <Text style={LOGO_L_TYPO}>L</Text>
            </View>
            <View style={LADS_WORDMARK_CONTAINER_SERVICOS}>
              <Text style={LADS_WORDMARK}>LADS</Text>
            </View>
          </View>
        </View>
        <LadsTopBarBellButton onPress={onPressBell} />
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between px-4 pb-2">
      <View className="flex-row items-center">
        <View style={LOGO_L_SHELL_STYLE}>
          <Text style={[LOGO_L_TYPO, { color: logoTint }]}>L</Text>
        </View>
        <Text className="ml-2" style={LADS_WORDMARK}>
          LADS
        </Text>
      </View>
      <LadsTopBarBellButton onPress={onPressBell} />
    </View>
  );
}
