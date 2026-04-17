import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PROFESSIONAL_CARLOS } from '@/constants/professionalsMock';
import type { ProfessionalProfile } from '@/types/professional';

import { ForumBottomNav } from '../forum/ForumBottomNav';

export interface ProfessionalProfileScreenProps {
  professional?: ProfessionalProfile;
  onBackPress?: () => void;
  onPressSolicitar?: () => void;
  onPressSeguir?: () => void;
  onPressMensagem?: () => void;
}

export function ProfessionalProfileScreen({
  professional = PROFESSIONAL_CARLOS,
  onBackPress,
  onPressSolicitar,
  onPressSeguir,
  onPressMensagem,
}: ProfessionalProfileScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-forum-bg">
      <View className="bg-lads-header-deep" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center px-2 pb-3">
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={onBackPress}
            className="h-10 w-10 items-center justify-center">
            <FontAwesome name="chevron-left" size={18} color="#FFFFFF" />
          </Pressable>
          <Text className="flex-1 text-center text-base font-semibold text-white" numberOfLines={1}>
            {professional.name}
          </Text>
          <View className="h-10 w-10" />
        </View>
      </View>

      <LinearGradient
        colors={['#4C1D95', '#7C3AED', '#9333EA']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 40,
        }}>
        <View className="rounded-full border-4 border-white p-0.5">
          <Image
            source={{ uri: professional.avatarUrl }}
            style={{ width: 112, height: 112, borderRadius: 56 }}
          />
        </View>
        <Text className="mt-4 text-center text-xl font-extrabold uppercase tracking-wide text-white">
          {professional.name}
        </Text>
        <Text className="mt-1 text-center text-base text-white">⭐ {professional.headline}</Text>
        <Text className="mt-1 text-center text-sm text-white/90">📍 {professional.affiliation}</Text>
        <Text className="mt-1 text-center text-sm text-white/85">🗓️ Membro desde: {professional.memberSince}</Text>
        <View className="mt-2 flex-row items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesome key={i} name="star" size={16} color="#FACC15" style={{ marginHorizontal: 1 }} />
          ))}
          <Text className="ml-2 text-sm text-white/90">({professional.votes} votos)</Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4"
        style={{ marginTop: -12 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}>
        <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <Text className="mb-3 text-sm font-bold uppercase tracking-wide text-forum-ink">🎯 EXPERTISE</Text>
          <View className="flex-row flex-wrap gap-2">
            {professional.expertise.map((tag) => (
              <View
                key={tag}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5">
                <Text className="text-xs font-semibold text-blue-700">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <Text className="mb-3 text-sm font-bold uppercase tracking-wide text-forum-ink">🏆 CONQUISTAS</Text>
          {professional.achievements.map((line) => (
            <View key={line} className="mb-2 flex-row items-start">
              <FontAwesome name="check-circle" size={18} color="#22C55E" style={{ marginTop: 1 }} />
              <Text className="ml-2 flex-1 text-sm leading-5 text-forum-ink">{line}</Text>
            </View>
          ))}
        </View>

        <View className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <Text className="mb-3 text-sm font-bold uppercase tracking-wide text-forum-ink">💼 CONTATO</Text>
          <View className="flex-row flex-wrap justify-between">
            <Pressable className="mb-3 w-[48%] items-center rounded-xl border border-blue-200 bg-lads-blue-soft py-3 active:opacity-80">
              <FontAwesome name="globe" size={20} color="#2563EB" />
              <Text className="mt-1 text-xs font-semibold text-lads-blue">Website</Text>
            </Pressable>
            <Pressable className="mb-3 w-[48%] items-center rounded-xl border border-blue-200 bg-lads-blue-soft py-3 active:opacity-80">
              <FontAwesome name="linkedin-square" size={22} color="#2563EB" />
              <Text className="mt-1 text-xs font-semibold text-lads-blue">LinkedIn</Text>
            </Pressable>
            <Pressable className="w-[48%] items-center rounded-xl border border-gray-200 bg-gray-100 py-3 active:opacity-80">
              <FontAwesome name="github" size={22} color="#374151" />
              <Text className="mt-1 text-xs font-semibold text-forum-ink">GitHub</Text>
            </Pressable>
            <Pressable className="w-[48%] items-center rounded-xl border border-red-200 bg-red-50 py-3 active:opacity-80">
              <FontAwesome name="envelope-o" size={20} color="#DC2626" />
              <Text className="mt-1 text-xs font-semibold text-red-600">Email</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-4 flex-row gap-2">
          <Pressable
            onPress={onPressSolicitar}
            className="flex-1 items-center rounded-xl bg-forum-primary py-3 active:opacity-90">
            <FontAwesome name="briefcase" size={16} color="#FFF" />
            <Text className="mt-1 text-center text-[11px] font-bold text-white">Solicitar Serviço</Text>
          </Pressable>
          <Pressable
            onPress={onPressSeguir}
            className="flex-1 items-center rounded-xl border-2 border-lads-blue bg-white py-3 active:opacity-80">
            <FontAwesome name="user-plus" size={16} color="#2563EB" />
            <Text className="mt-1 text-center text-[11px] font-bold text-lads-blue">Seguir</Text>
          </Pressable>
          <Pressable
            onPress={onPressMensagem}
            className="flex-1 items-center rounded-xl border-2 border-lads-blue bg-white py-3 active:opacity-80">
            <FontAwesome name="comment-o" size={16} color="#2563EB" />
            <Text className="mt-1 text-center text-[11px] font-bold text-lads-blue">Enviar Msg</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ForumBottomNav active="profis" accent="blue" />
    </View>
  );
}
