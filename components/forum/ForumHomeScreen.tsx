import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
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

import { LadsTopBarBellButton } from '@/components/lads/LadsTopBar';

import { ForumBottomNav, FORUM_BOTTOM_NAV_ROW_HEIGHT } from './ForumBottomNav';
import { ForumDualHeaderBar } from './ForumDualHeaderBar';
import { ForumFilterChip } from './ForumFilterChip';
import { ForumPinnedCard } from './ForumPinnedCard';
import { ForumPostCard } from './ForumPostCard';

/** Figma ForumHome: largura do frame + barra superior */
const FORUM_HOME_MAX_WIDTH = 448;

export function ForumHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<ForumCategory>('Geral');

  const visiblePosts = useMemo(() => {
    if (filter === 'Geral') return FORUM_POSTS;
    return FORUM_POSTS.filter((p) => p.tag === filter);
  }, [filter]);

  const scrollBottomPad = 20 + FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 0);

  return (
    <View className="flex-1 bg-forum-bg">
      <View className="w-full self-center">
        <ForumDualHeaderBar
          paddingTop={insets.top}
          screenTitle={FORUM_HOME_HEADER.screenTitle}
          eventName={FORUM_HOME_HEADER.eventName}
          dateLabel={FORUM_HOME_HEADER.dateLabel}
          subscribers={FORUM_HOME_HEADER.subscribers}
          onBack={() => router.back()}
          headerRight={<LadsTopBarBellButton />}
          maxWidth={FORUM_HOME_MAX_WIDTH}
          contentInsetRight={Math.max(insets.right, 16)}
        />
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
