import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FORUM_HOME_CHIP_ROW_GAP,
  FORUM_HOME_MAIN_CONTENT_GAP,
  FORUM_HOME_MAIN_CONTENT_PAD,
} from '@/constants/forumHomeLayout';
import {
  FORUM_FILTERS,
  FORUM_HOME_HEADER,
  FORUM_PINNED,
  FORUM_POSTS,
} from '@/constants/forumMock';
import type { ForumCategory } from '@/types/forum';

import { ForumBackArrowIcon20 } from './ForumBackArrowIcon20';
import { ForumBottomNav, FORUM_BOTTOM_NAV_ROW_HEIGHT } from './ForumBottomNav';
import { ForumFilterChip } from './ForumFilterChip';
import { ForumPinnedCard } from './ForumPinnedCard';
import { ForumPostCard } from './ForumPostCard';

/** Figma ForumHome: largura do frame + barra superior */
const FORUM_HOME_MAX_WIDTH = 448;

/** Barra 1 (sólida): sombra Figma */
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

export function ForumHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<ForumCategory>('Geral');

  const visiblePosts = useMemo(() => {
    if (filter === 'Geral') return FORUM_POSTS;
    return FORUM_POSTS.filter((p) => p.tag === filter);
  }, [filter]);

  const scrollBottomPad = 20 + FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 0);

  const topBarShadow =
    Platform.OS === 'web' ? FORUM_TOP_BAR_SHADOW_WEB : FORUM_TOP_BAR_SHADOW_NATIVE;

  return (
    <View className="flex-1 bg-forum-bg">
      <View
        className="w-full self-center"
        style={{
          maxWidth: FORUM_HOME_MAX_WIDTH,
          paddingTop: insets.top,
        }}>
        {/* Barra 1 — Figma: 56px, #432DD7, voltar + título (sem sino nesta página) */}
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
            onPress={() => router.back()}
            className="h-10 w-10 shrink-0 items-center justify-center">
            {/* Figma: ícone 20×20, flex-shrink 0; stretch no eixo do botão */}
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
          {/* Figma: fluxo horizontal — título logo após a seta (não centralizado no resto da barra) */}
          <View
            style={{
              width: 175,
              height: 20,
              flexShrink: 0,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}>
            <Text
              {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                width: 175,
                color: '#FFFFFF',
                fontFamily: 'Inter_600SemiBold',
                fontSize: 14,
                fontStyle: 'normal',
                lineHeight: 20,
                letterSpacing: 0,
                textAlign: 'left',
              }}>
              {FORUM_HOME_HEADER.screenTitle}
            </Text>
          </View>
        </View>

        {/* Barra 2 — lua: PNG 30×30 no slot Figma (estado após tirar o círculo escuro) */}
        <LinearGradient
          colors={['#8200DB', '#432DD7']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            width: '100%',
            height: 60,
            paddingLeft: 16,
            paddingRight: Math.max(insets.right, 16),
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
          {/* Figma: coluna 138,667 — título + meta, alinhada à esquerda, centrada na altura da barra */}
          <View
            style={{
              width: 138.667,
              flexShrink: 0,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 4,
            }}>
            <Text
              {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
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
              {FORUM_HOME_HEADER.eventName}
            </Text>
            <View
              style={{
                width: 154,
                height: 16,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <Text
                {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
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
                {FORUM_HOME_HEADER.dateLabel} • {FORUM_HOME_HEADER.subscribers} inscritos
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Figma Main Content: width 448, flex 1 0 0 */}
      <View
        style={{
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 0,
          width: '100%',
          maxWidth: FORUM_HOME_MAX_WIDTH,
          alignSelf: 'center',
          minWidth: 0,
          minHeight: 0,
        }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: scrollBottomPad,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingHorizontal: FORUM_HOME_MAIN_CONTENT_PAD,
              paddingTop: FORUM_HOME_MAIN_CONTENT_PAD,
              paddingBottom: FORUM_HOME_MAIN_CONTENT_PAD,
              gap: FORUM_HOME_MAIN_CONTENT_GAP,
            }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ minHeight: 60 }}
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: FORUM_HOME_CHIP_ROW_GAP,
                paddingRight: 8,
              }}>
              {FORUM_FILTERS.map((label) => (
                <ForumFilterChip
                  key={label}
                  label={label}
                  active={filter === label}
                  onPress={() => setFilter(label)}
                />
              ))}
            </ScrollView>

            <ForumPinnedCard post={FORUM_PINNED} />

            {visiblePosts.length === 0 ? (
              <View className="items-center rounded-2xl border border-dashed border-gray-300 bg-white/80 py-10 px-4">
                <Text className="text-center text-base font-semibold text-forum-ink">
                  Nenhum tópico nesta categoria
                </Text>
                <Text className="mt-2 text-center text-sm text-forum-muted">
                  Troque o filtro ou selecione Geral para ver todos os posts.
                </Text>
              </View>
            ) : (
              visiblePosts.map((post) => <ForumPostCard key={post.id} post={post} />)
            )}
          </View>
        </ScrollView>
      </View>

      <ForumBottomNav active="forum" />
    </View>
  );
}
