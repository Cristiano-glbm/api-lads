import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FORUM_HOME_HEADER } from '@/constants/forumMock';
import type { ForumPost, ForumReply } from '@/types/forum';

import { ForumBackArrowIcon20 } from './ForumBackArrowIcon20';
import { ForumBottomNav, FORUM_BOTTOM_NAV_ROW_HEIGHT } from './ForumBottomNav';

const MAX_WIDTH = 448;

const androidNoPad = Platform.OS === 'android' ? { includeFontPadding: false as const } : {};

const CARD_SHADOW_WEB = {
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
} as const;

const CARD_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
} as const;

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#432DD7',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
      <Text
        {...androidNoPad}
        style={{
          color: '#FFFFFF',
          fontFamily: 'Inter_600SemiBold',
          fontSize: 14,
          lineHeight: 18,
        }}>
        {initials}
      </Text>
    </View>
  );
}

export interface ForumPostDetailScreenProps {
  post: ForumPost;
}

export function ForumPostDetailScreen({ post }: ForumPostDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const cardShadow = Platform.OS === 'web' ? CARD_SHADOW_WEB : CARD_SHADOW_NATIVE;
  const scrollBottomPad = 20 + FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* Cabeçalho: barra escura + faixa roxa com título do post */}
      <View style={{ width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', paddingTop: insets.top }}>
        {/* Barra superior escura */}
        <View
          style={{
            height: 56,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#432DD7',
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={12}
            onPress={() => router.back()}
            style={{ width: 40, height: 40, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
            <ForumBackArrowIcon20 color="#FFFFFF" />
          </Pressable>
          <View style={{ flex: 1, minWidth: 0, height: 20, justifyContent: 'center' }}>
            <Text
              {...androidNoPad}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 20 }}>
              {FORUM_HOME_HEADER.screenTitle}
            </Text>
          </View>
        </View>

        {/* Faixa roxa com título e autor do post */}
        <LinearGradient
          colors={['#8200DB', '#432DD7']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 12 }}>
          <Text
            {...androidNoPad}
            style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 21 }}>
            {post.title}
          </Text>
          <Text
            {...androidNoPad}
            style={{ color: '#E9D4FF', fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16, marginTop: 2 }}>
            por {post.author}
          </Text>
        </LinearGradient>
      </View>

      {/* Conteúdo rolável */}
      <ScrollView
        style={{ flex: 1, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' }}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: scrollBottomPad }}
        showsVerticalScrollIndicator={false}>

        {/* Card do post (título, avatar, data e corpo) */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            padding: 16,
            ...cardShadow,
          }}>
          {/* Avatar + nome + data */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <AuthorAvatar name={post.author} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                {...androidNoPad}
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 14,
                  lineHeight: 18,
                  color: '#1E2939',
                }}>
                {post.author}
              </Text>
              {post.date ? (
                <Text
                  {...androidNoPad}
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    lineHeight: 16,
                    color: '#6B7280',
                    marginTop: 2,
                  }}>
                  {post.date}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Corpo do post */}
          {post.body ? (
            <Text
              {...androidNoPad}
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                lineHeight: 21,
                color: '#1E2939',
              }}>
              {post.body}
            </Text>
          ) : null}
        </View>

        {/* Seção de comentários */}
        {post.replies && post.replies.length > 0 ? (
          <View>
            <Text
              {...androidNoPad}
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
                lineHeight: 20,
                color: '#1E2939',
                marginBottom: 8,
              }}>
              Comentarios
            </Text>

            {post.replies.map((reply: ForumReply) => (
              <View
                key={reply.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: reply.isLads ? '#C4B5FD' : '#E5E7EB',
                  padding: 12,
                  marginBottom: 8,
                  ...cardShadow,
                }}>
                <Text
                  {...androidNoPad}
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 13,
                    lineHeight: 18,
                    color: reply.isLads ? '#432DD7' : '#1E2939',
                    marginBottom: 4,
                  }}>
                  {reply.author}
                </Text>
                <Text
                  {...androidNoPad}
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    lineHeight: 18,
                    color: '#4B5563',
                  }}>
                  {reply.text}
                </Text>
              </View>
            ))}

            <Pressable style={{ paddingVertical: 8, alignItems: 'center' }}>
              <Text
                {...androidNoPad}
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 13,
                  lineHeight: 18,
                  color: '#432DD7',
                }}>
                Ver todas as respostas ({post.comments}) →
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <ForumBottomNav active="forum" />
    </View>
  );
}
