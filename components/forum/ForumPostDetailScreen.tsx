import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { FORUM_HOME_HEADER } from '@/constants/forumMock';
import * as forumService from '@/services/forumService';
import type { ForumPost, ForumReply } from '@/types/forum';
import { useAuth } from '@/context/AuthContext';

import { ForumBackArrowIcon20 } from './ForumBackArrowIcon20';
import { ForumBottomNav } from './ForumBottomNav';
import { MentionTextInput } from './MentionTextInput';

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

/** Renderiza texto com @menções destacadas em roxo */
function TextWithMentions({ text, style }: { text: string; style?: object }) {
  const parts = text.split(/(@\S+)/g);
  return (
    <Text {...androidNoPad} style={style}>
      {parts.map((part, i) =>
        part.startsWith('@') ? (
          <Text key={i} style={{ color: '#432DD7', fontFamily: 'Inter_600SemiBold' }}>
            {part}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        ),
      )}
    </Text>
  );
}

export interface ForumPostDetailScreenProps {
  post: ForumPost;
}

export function ForumPostDetailScreen({ post }: ForumPostDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { user } = useAuth();

  const [replies, setReplies] = useState<ForumReply[]>(post.replies ?? []);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes ?? 0);
  const [likingInProgress, setLikingInProgress] = useState(false);

  const cardShadow = Platform.OS === 'web' ? CARD_SHADOW_WEB : CARD_SHADOW_NATIVE;
  const scrollBottomPad = 16;

  async function handleToggleLike() {
    if (likingInProgress) return;
    setLikingInProgress(true);
    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((c) => (wasLiked ? Math.max(0, c - 1) : c + 1));
    try {
      await forumService.likePost(post.id);
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setLikesCount((c) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
    } finally {
      setLikingInProgress(false);
    }
  }

  async function handleSendComment() {
    const content = commentText.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      const newComment = await forumService.addComment(post.id, content);
      setReplies((prev) => [
        ...prev,
        {
          id: newComment.id ?? String(Date.now()),
          author: newComment.author?.name ?? user?.name ?? 'Você',
          authorId: newComment.author?.id ?? user?.id,
          text: content,
        },
      ]);
      setCommentText('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      /* keep text, let user retry */
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    setReplies((prev) => prev.filter((r) => r.id !== commentId));
    try {
      await forumService.deleteComment(commentId);
    } catch {
      // Re-fetch would be ideal; for now silently keep optimistic delete
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F3F4F6' }} behavior="padding">
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
          colors={['#2563EB', '#06B6D4']}
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
        ref={scrollRef}
        style={{ flex: 1, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' }}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: scrollBottomPad }}
        keyboardShouldPersistTaps="handled"
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
            <TextWithMentions
              text={post.body}
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                lineHeight: 21,
                color: '#1E2939',
              }}
            />
          ) : null}

          {/* Imagem do post */}
          {post.imageUrl ? (
            <Image
              source={{ uri: post.imageUrl }}
              style={{ width: '100%', height: 200, borderRadius: 10, marginTop: 12, backgroundColor: '#F3F4F6' }}
              resizeMode="cover"
            />
          ) : null}

          {/* Barra de curtir */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 6 }}>
            <Pressable
              onPress={handleToggleLike}
              disabled={likingInProgress}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 7,
                paddingHorizontal: 14,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: liked ? '#432DD7' : '#E5E7EB',
                backgroundColor: liked ? '#EEF2FF' : '#F9FAFB',
                opacity: pressed ? 0.75 : 1,
              })}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={16}
                color={liked ? '#EF4444' : '#6B7280'}
              />
              <Text
                {...androidNoPad}
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 13,
                  color: liked ? '#432DD7' : '#6B7280',
                  lineHeight: 18,
                }}>
                {likesCount > 0 ? likesCount : ''}{likesCount > 0 ? ' ' : ''}{liked ? 'Curtido' : 'Curtir'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Seção de comentários */}
        {replies.length > 0 ? (
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
              Comentários ({replies.length})
            </Text>

            {replies.map((reply: ForumReply) => (
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
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Text
                    {...androidNoPad}
                    style={{
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 13,
                      lineHeight: 18,
                      color: reply.isLads ? '#432DD7' : '#1E2939',
                      marginBottom: 4,
                      flex: 1,
                    }}>
                    {reply.author}
                  </Text>
                  {(reply.authorId && reply.authorId === user?.id) || user?.role === 'ADMIN' ? (
                    <Pressable
                      onPress={() => handleDeleteComment(reply.id)}
                      hitSlop={8}
                      style={{ paddingLeft: 8, paddingTop: 2 }}>
                      <Text style={{ fontSize: 14, color: '#9CA3AF' }}>✕</Text>
                    </Pressable>
                  ) : null}
                </View>
                <TextWithMentions
                  text={reply.text}
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    lineHeight: 18,
                    color: '#4B5563',
                  }}
                />
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {/* Barra de comentário fixa na parte inferior */}
      <View
        style={{
          width: '100%',
          maxWidth: MAX_WIDTH,
          alignSelf: 'center',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingHorizontal: 12,
          paddingVertical: 10,
          paddingBottom: Math.max(insets.bottom, 10),
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 8,
          zIndex: 10,
        }}>
        <MentionTextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Comentar… use @ para mencionar"
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={1000}
          inputStyle={{
            flex: 1,
            minHeight: 40,
            maxHeight: 100,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: '#1E2939',
            backgroundColor: '#F9FAFB',
            ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
          }}
          style={{ flex: 1 }}
        />
        <Pressable
          onPress={handleSendComment}
          disabled={!commentText.trim() || sending}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: commentText.trim() && !sending ? '#432DD7' : '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            opacity: pressed ? 0.8 : 1,
          })}>
          {sending
            ? <ActivityIndicator size="small" color="#432DD7" />
            : (
              <Text {...androidNoPad} style={{ color: '#FFFFFF', fontSize: 18, lineHeight: 20 }}>↑</Text>
            )
          }
        </Pressable>
      </View>

      <ForumBottomNav active="forum" />
    </KeyboardAvoidingView>
  );
}
