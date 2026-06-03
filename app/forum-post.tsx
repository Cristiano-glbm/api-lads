import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { FORUM_POSTS } from '@/constants/forumMock';
import { ForumPostDetailScreen } from '@/components/forum/ForumPostDetailScreen';
import type { ForumPost, ForumPostIcon, ForumCategory } from '@/types/forum';
import * as forumService from '@/services/forumService';

const VALID_ICONS: ForumPostIcon[] = ['bulb', 'handshake', 'question'];
const VALID_TAGS: ForumCategory[] = ['Geral', 'Técnico', 'Networking', 'Dúvidas'];

export default function ForumPostRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<ForumPost | null>(
    FORUM_POSTS.find((p) => p.id === id) ?? null
  );
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    if (!id) return;
    forumService.getPost(id)
      .then((p) => {
        const icon: ForumPostIcon = VALID_ICONS.includes(p.icon as ForumPostIcon)
          ? (p.icon as ForumPostIcon) : 'bulb';
        const tag: ForumCategory = VALID_TAGS.includes(p.tag as ForumCategory)
          ? (p.tag as ForumCategory) : 'Geral';
        const replies = p.comments?.map((c) => ({
          id: c.id,
          author: c.author?.name ?? 'Anônimo',
          authorId: c.author?.id,
          text: c.content,
        }));
        setPost({
          id: p.id,
          title: p.title,
          author: p.author?.name ?? 'Anônimo',
          authorId: p.author?.id,
          body: p.content,
          imageUrl: p.imageUrl,
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR') : undefined,
          likes: p._count?.postLikes ?? p._count?.likes ?? p.likes ?? 0,
          liked: p.liked ?? false,
          comments: p._count?.comments ?? 0,
          tag,
          icon,
          replies,
        });
      })
      .catch(() => { /* keep mock fallback */ })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#432DD7" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#432DD7" />
      </View>
    );
  }

  return <ForumPostDetailScreen post={post} />;
}
