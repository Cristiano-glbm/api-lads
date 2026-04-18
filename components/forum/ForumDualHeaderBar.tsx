import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';

import { ForumBackArrowIcon20 } from './ForumBackArrowIcon20';

const FORUM_TOP_BAR_SHADOW_WEB = {
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
} as const;

const FORUM_TOP_BAR_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
} as const;

const androidNoPad = Platform.OS === 'android' ? { includeFontPadding: false as const } : {};

export type ForumDualHeaderBarProps = {
  paddingTop: number;
  /** Ex.: "Noite Sem Pijama - Fórum" ou "… - Eventos" */
  screenTitle: string;
  eventName: string;
  dateLabel: string;
  subscribers: number;
  onBack: () => void;
  /** Ex.: sino de notificações (Figma Detalhes - Evento) */
  headerRight?: ReactNode;
  /** Largura máx. do bloco (ex. 448 no ForumHome); omitir = largura total */
  maxWidth?: number;
  contentInsetRight?: number;
};

/**
 * Duas barras do topo do Fórum / Eventos: (1) fundo `forum-header` + voltar + título;
 * (2) gradiente roxo + lua + nome do evento + data • inscritos.
 */
export function ForumDualHeaderBar({
  paddingTop,
  screenTitle,
  eventName,
  dateLabel,
  subscribers,
  onBack,
  headerRight,
  maxWidth,
  contentInsetRight = 16,
}: ForumDualHeaderBarProps) {
  const topBarShadow =
    Platform.OS === 'web' ? FORUM_TOP_BAR_SHADOW_WEB : FORUM_TOP_BAR_SHADOW_NATIVE;

  return (
    <View
      style={{
        width: '100%',
        maxWidth: maxWidth ?? undefined,
        alignSelf: maxWidth != null ? 'center' : 'stretch',
        paddingTop,
      }}>
      <View
        className="bg-forum-header"
        style={{
          height: 56,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          ...topBarShadow,
        }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          onPress={onBack}
          className="h-10 w-10 shrink-0 items-center justify-center">
          <View
            style={{
              height: 20,
              flexShrink: 0,
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ForumBackArrowIcon20 color="#FFFFFF" />
          </View>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0, height: 20, justifyContent: 'center' }}>
          <Text
            {...androidNoPad}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: '#FFFFFF',
              fontFamily: 'Inter_600SemiBold',
              fontSize: 14,
              fontStyle: 'normal',
              lineHeight: 20,
              letterSpacing: 0,
              textAlign: 'left',
            }}>
            {screenTitle}
          </Text>
        </View>
        {headerRight != null ? (
          <View style={{ flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>{headerRight}</View>
        ) : null}
      </View>

      <LinearGradient
        colors={['#8200DB', '#432DD7']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width: '100%',
          height: 60,
          paddingLeft: 16,
          paddingRight: Math.max(contentInsetRight, 16),
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
        <View
          style={{
            width: 40.5333,
            height: 36,
            paddingTop: 0,
            paddingRight: 10.533,
            paddingBottom: 3.2,
            paddingLeft: 0,
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 0,
          }}>
          <Image
            accessibilityRole="image"
            accessibilityLabel="Lua do evento"
            source={require('../../assets/images/forum-moon.png')}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            flex: 1,
            minWidth: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 4,
          }}>
          <Text
            {...androidNoPad}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              width: '100%',
              color: '#FFFFFF',
              fontFamily: 'Inter_700Bold',
              fontSize: 14,
              fontStyle: 'normal',
              lineHeight: 20,
              letterSpacing: 0,
              textAlign: 'left',
            }}>
            {eventName}
          </Text>
          <Text
            {...androidNoPad}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: '#E9D4FF',
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              fontStyle: 'normal',
              lineHeight: 16,
              letterSpacing: 0,
              textAlign: 'left',
            }}>
            {dateLabel} • {subscribers} inscritos
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
