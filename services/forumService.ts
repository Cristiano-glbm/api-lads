import { api } from './api';

export interface ApiForumPost {
  id: string;
  title: string;
  content?: string;
  icon?: string;
  tag?: string;
  likes: number;
  pinned: boolean;
  createdAt: string;
  author: { id: string; name: string; avatar?: string };
  _count?: { comments: number; likes: number };
}

export interface ApiForumComment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; avatar?: string };
}

interface PostsResponse {
  success: boolean;
  data: ApiForumPost[];
  pagination?: unknown;
}

interface PostResponse {
  success: boolean;
  data: ApiForumPost & { comments?: ApiForumComment[] };
}

interface CommentsResponse {
  success: boolean;
  data: ApiForumComment[];
}

export interface CreatePostData {
  title: string;
  content?: string;
  icon?: string;
  tag?: string;
}

export async function listPosts(params?: {
  tag?: string;
  search?: string;
  pinned?: boolean;
}): Promise<ApiForumPost[]> {
  const q = new URLSearchParams();
  if (params?.tag) q.set('tag', params.tag);
  if (params?.search) q.set('search', params.search);
  if (params?.pinned) q.set('pinned', 'true');
  const query = q.toString() ? `?${q.toString()}` : '';
  const res = await api.get<PostsResponse>(`/api/forum/posts${query}`, false);
  return res.data;
}

export async function getPost(id: string): Promise<ApiForumPost & { comments?: ApiForumComment[] }> {
  const res = await api.get<PostResponse>(`/api/forum/posts/${id}`, false);
  return res.data;
}

export async function createPost(data: CreatePostData): Promise<ApiForumPost> {
  const res = await api.post<PostResponse>('/api/forum/posts', data);
  return res.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/api/forum/posts/${id}`);
}

export async function likePost(id: string): Promise<void> {
  await api.post(`/api/forum/posts/${id}/like`, {});
}

export async function getComments(postId: string): Promise<ApiForumComment[]> {
  const res = await api.get<CommentsResponse>(`/api/forum/posts/${postId}/comments`, false);
  return res.data;
}

export async function addComment(postId: string, content: string): Promise<ApiForumComment> {
  const res = await api.post<{ success: boolean; data: { comment: ApiForumComment } }>(
    `/api/forum/posts/${postId}/comments`,
    { content }
  );
  return res.data.comment;
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/api/forum/comments/${id}`);
}
