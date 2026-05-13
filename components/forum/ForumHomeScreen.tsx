import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
import type { ForumCategory, ForumPost, ForumPostIcon } from '@/types/forum';
import type { ApiForumPost } from '@/services/forumService';
import * as forumService from '@/services/forumService';

import { useAuth } from '@/context/AuthContext';
import { LadsModal } from '@/components/lads/LadsModal';
import { LadsTopBarBellButton } from '@/components/lads/LadsTopBar';

import { ForumBottomNav, FORUM_BOTTOM_NAV_ROW_HEIGHT } from './ForumBottomNav';
import { ForumDualHeaderBar } from './ForumDualHeaderBar';
import { ForumFilterChip } from './ForumFilterChip';
import { ForumPinnedCard } from './ForumPinnedCard';
import { ForumPostCard } from './ForumPostCard';

/** Figma ForumHome: largura do frame + barra superior */
const FORUM_HOME_MAX_WIDTH = 448;


function mapApiPost(p: ApiForumPost, currentUser?: { id: string; name: string } | null): ForumPost {
  const VALID_ICONS: ForumPostIcon[] = ['bulb', 'handshake', 'question'];
  const icon: ForumPostIcon = VALID_ICONS.includes(p.icon as ForumPostIcon)
    ? (p.icon as ForumPostIcon)
    : 'bulb';
  const VALID_TAGS: ForumCategory[] = ['Geral', 'Técnico', 'Networking', 'Dúvidas'];
  const tag: ForumCategory = VALID_TAGS.includes(p.tag as ForumCategory)
    ? (p.tag as ForumCategory)
    : 'Geral';
  const isOwn = currentUser && p.author?.id === currentUser.id;
  return {
    id: p.id,
    title: p.title,
    author: isOwn ? currentUser.name : (p.author?.name ?? 'Anônimo'),
    authorId: p.author?.id,
    body: p.content,
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR') : undefined,
    likes: p._count?.likes ?? p.likes ?? 0,
    comments: p._count?.comments ?? 0,
    tag,
    icon,
  };
}

export function ForumHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<ForumCategory>('Geral');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      forumService.listPosts()
        .then((list) => {
          if (list.length > 0) setPosts(list.map((p) => mapApiPost(p, user)));
        })
        .catch(() => { /* keep fallback */ });
    }, [user])
  );

  const visiblePosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = filter === 'Geral' ? posts : posts.filter((p) => p.tag === filter);
    if (q) result = result.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      (p.body ?? '').toLowerCase().includes(q)
    );
    return result;
  }, [filter, query, posts]);

  const scrollBottomPad = 20 + FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 0);

  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      await forumService.deletePost(deleteTargetId);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTargetId));
    } finally {
      setDeleteTargetId(null);
    }
  }

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
        {/* FAB Novo Tópico — dentro do container 448 para ficar centrado na web */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Novo Tópico"
          onPress={() => router.push('/forum-novo-topico')}
          style={({ pressed }) => ({
            position: 'absolute',
            bottom: FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 0) + 16,
            right: 20,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#432DD7',
            borderRadius: 9999,
            paddingVertical: 12,
            paddingHorizontal: 18,
            opacity: pressed ? 0.88 : 1,
            shadowColor: '#432DD7',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 6,
          })}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 20, color: '#FFFFFF' }}>
            Novo Tópico
          </Text>
        </Pressable>

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
            {/* Busca */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: query ? '#432DD7' : '#E5E7EB',
                paddingHorizontal: 14,
                paddingVertical: 10,
                gap: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
                elevation: 1,
              }}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  stroke={query ? '#432DD7' : '#9CA3AF'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar tópicos, autores..."
                placeholderTextColor="#9CA3AF"
                returnKeyType="search"
                style={{
                  flex: 1,
                  fontFamily: 'Inter_400Regular',
                  fontSize: 14,
                  color: '#1E2939',
                  paddingVertical: 0,
                  margin: 0,
                  ...(Platform.OS === 'android' ? { includeFontPadding: false, textAlignVertical: 'center' } : {}),
                }}
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M18 6 6 18M6 6l12 12"
                      stroke="#9CA3AF"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </Svg>
                </Pressable>
              ) : null}
            </View>

            {/* Filtros por categoria */}
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
              visiblePosts.map((post) => (
                <ForumPostCard
                  key={post.id}
                  post={post}
                  onPress={() => router.push(`/forum-post?id=${post.id}`)}
                  onDelete={post.authorId === user?.id ? () => setDeleteTargetId(post.id) : undefined}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>

      <ForumBottomNav active="forum" />

      <LadsModal
        visible={!!deleteTargetId}
        title="Excluir tópico"
        message="Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita."
        buttons={[
          { text: 'Cancelar', style: 'cancel', onPress: () => setDeleteTargetId(null) },
          { text: 'Excluir', style: 'destructive', onPress: confirmDelete },
        ]}
        onRequestClose={() => setDeleteTargetId(null)}
      />
    </View>
  );
}
