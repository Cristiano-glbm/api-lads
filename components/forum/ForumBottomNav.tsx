import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumEventsTabIcon20 } from './ForumEventsTabIcon20';
import { ForumHomeTabIcon20 } from './ForumHomeTabIcon20';

/** Inspect Figma (barra inferior): border-top #E5E7EB */
const NAV_BORDER = '#E5E7EB';

/** Inspect Figma (Container): 448×64, padding 1.067px 0 0, border-top 1.067px inside, fundo #FFF */
const NAV_MAX_WIDTH = 448;
export const FORUM_BOTTOM_NAV_ROW_HEIGHT = 64;
const NAV_ROW_HEIGHT = FORUM_BOTTOM_NAV_ROW_HEIGHT;
const NAV_TOP_EDGE = 16 / 15;
/** Altura útil da linha de tabs (64 − borderTop − paddingTop, ~61,87 no Inspect) */
const NAV_TAB_COLUMN_HEIGHT = NAV_ROW_HEIGHT - 2 * NAV_TOP_EDGE;

/** Figma CSS: `box-shadow: 0 10px 15px -3px rgba(0,0,0,.10), 0 4px 6px -4px rgba(0,0,0,.10)` */
const NAV_SHADOW_WEB = {
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)',
} as const;

/** iOS/Android: aproximação das duas sombras (RN: uma sombra + elevation) */
const NAV_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 10,
} as const;

/**
 * Cada tab ocupa 1/5 da largura real da barra.
 * Evita `width: 448/5` fixo: em ecrãs < 448px isso somava 448px e fazia overflow,
 * deslocando visualmente Fórum / Profis. / Perfil em relação aos rótulos.
 */
const TAB_BTN = {
  flex: 1,
  minWidth: 0,
  height: NAV_TAB_COLUMN_HEIGHT,
  paddingTop: 0,
  flexDirection: 'column' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  gap: 3,
};

export type ForumBottomTab = 'inicio' | 'eventos' | 'forum' | 'perfil' | 'profis';

export interface ForumBottomNavProps {
  active: ForumBottomTab;
  accent?: 'purple' | 'blue';
}

interface NavItem {
  id: ForumBottomTab;
  label: string;
  icon: ComponentProps<typeof FontAwesome>['name'];
}

const ITEMS: NavItem[] = [
  { id: 'inicio',  label: 'Início',  icon: 'home'      },
  { id: 'eventos', label: 'Eventos', icon: 'calendar'  },
  { id: 'forum',   label: 'Fórum',   icon: 'comments'  },
  { id: 'profis',  label: 'Profis.',  icon: 'users'     },
  { id: 'perfil',  label: 'Perfil',  icon: 'user'      },
];

const ACCENT = {
  /** Alinhado ao stroke do ícone Início (Figma #4F39F6) */
  purple: { fg: '#4F39F6' },
  blue: { fg: '#2563EB' },
} as const;

/** Tab inativa — alinhado ao traço do ícone Início (#949EAE) */
const TAB_INACTIVE = '#949EAE';
const TAB_ICON_SIZE = 20;

/**
 * Inspect Figma: `Container` em volta do texto de cada Button — igual em todas as tabs.
 * display: flex; justify-content: center; align-items: center;
 * (em RN: flexDirection row + width 100% no slot da tab, ~89.6px)
 */
const TAB_LABEL_CONTAINER = {
  width: '100%' as const,
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

/**
 * Inspect Figma: Inter 500, 10/10, letter-spacing 0.
 * `marginTop` negativo fazia o rótulo subir e sobrepor o ícone nas primeiras tabs (ícones SVG 20×20).
 */
const TAB_LABEL_MARGIN_TOP = 0;

const TAB_LABEL_TEXT = {
  fontFamily: 'Inter_500Medium',
  fontSize: 10,
  lineHeight: 10,
  letterSpacing: 0,
  height: 10,
  marginTop: TAB_LABEL_MARGIN_TOP,
  fontStyle: 'normal' as const,
  textAlign: 'center' as const,
};

/**
 * Inspect Figma: container do ícone na tab — 28×28, padding 4 4 0 4, coluna,
 * align-items flex-start, radius 10, #FFF, sombra leve (asset ícone 20×20).
 */
const ICON_SHELL = {
  width: 28,
  height: 28,
  paddingTop: 4,
  paddingRight: 4,
  paddingBottom: 0,
  paddingLeft: 4,
  flexDirection: 'column' as const,
  alignItems: 'flex-start' as const,
  flexShrink: 0 as const,
  borderRadius: 10,
  backgroundColor: '#FFFFFF',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
};

const TAB_ICON_FRAME = {
  width: '100%' as const,
  height: 24,
  flexShrink: 0 as const,
  alignSelf: 'stretch' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

export function ForumBottomNav({ active, accent = 'purple' }: ForumBottomNavProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const a = ACCENT[accent];

  const navShadow = Platform.OS === 'web' ? NAV_SHADOW_WEB : NAV_SHADOW_NATIVE;
  const safeBottom = Math.max(insets.bottom, 0);

  const goTab = (id: ForumBottomTab) => {
    if (id === active) return;
    switch (id) {
      case 'inicio':   router.push('/home');           break;
      case 'eventos':  router.push('/eventos');        break;
      case 'forum':    router.push('/forum');          break;
      case 'profis':   router.push('/profissionais');  break;
      case 'perfil':   router.push('/perfil');         break;
    }
  };

  return (
    <View
      style={{
        width: '100%',
        maxWidth: NAV_MAX_WIDTH,
        alignSelf: 'center',
        paddingBottom: safeBottom,
        backgroundColor: '#FFFFFF',
      }}>
      <View
        style={{
          width: '100%',
          height: NAV_ROW_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: NAV_TOP_EDGE,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          borderTopWidth: NAV_TOP_EDGE,
          borderTopColor: NAV_BORDER,
          backgroundColor: '#FFFFFF',
          ...navShadow,
        }}>
        {ITEMS.map((item) => {
          const isActive = item.id === active;
          const color = isActive ? a.fg : TAB_INACTIVE;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
              onPress={() => goTab(item.id)}
              style={TAB_BTN}>
              <View
                style={{
                  height: 4,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {isActive ? (
                  <View
                    style={{
                      height: 4,
                      width: 40,
                      borderRadius: 9999,
                      backgroundColor: a.fg,
                    }}
                  />
                ) : null}
              </View>
              <View style={TAB_ICON_FRAME}>
                {item.id === 'inicio' ? (
                  <ForumHomeTabIcon20 active={isActive} accent={accent} />
                ) : item.id === 'eventos' ? (
                  <ForumEventsTabIcon20 active={isActive} accent={accent} />
                ) : (
                  <FontAwesome name={item.icon} size={TAB_ICON_SIZE} color={color} />
                )}
              </View>
              <View style={TAB_LABEL_CONTAINER}>
                <Text
                  {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
                  style={{
                    ...TAB_LABEL_TEXT,
                    color: isActive ? a.fg : TAB_INACTIVE,
                  }}>
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
