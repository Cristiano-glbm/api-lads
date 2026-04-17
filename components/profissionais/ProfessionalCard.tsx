import { FontAwesome } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import type { ProfessionalListItem } from '@/types/professional';

export interface ProfessionalCardProps {
  professional: ProfessionalListItem;
  onPressContratar?: (id: string) => void;
}

export function ProfessionalCard({ professional, onPressContratar }: ProfessionalCardProps) {
  return (
    <View className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <View className="flex-row">
        <Image
          source={{ uri: professional.avatarUrl }}
          className="h-16 w-16 rounded-full border border-gray-100"
        />
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-forum-ink">{professional.name}</Text>
          <Text className="mt-0.5 text-sm text-forum-primary">
            ⭐ {professional.role}
          </Text>
          <Text className="mt-0.5 text-xs text-forum-muted">📍 {professional.affiliation}</Text>
          <View className="mt-1 flex-row items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesome
                key={i}
                name={i < professional.rating ? 'star' : 'star-o'}
                size={14}
                color="#EAB308"
                style={{ marginRight: 2 }}
              />
            ))}
            <Text className="ml-1 text-xs text-forum-muted">({professional.votes})</Text>
          </View>
        </View>
      </View>
      <View className="mt-4 flex-row gap-2">
        <Pressable className="flex-1 items-center rounded-xl border border-blue-200 bg-lads-blue-soft py-2.5 active:opacity-80">
          <FontAwesome name="linkedin-square" size={20} color="#2563EB" />
          <Text className="mt-1 text-xs font-semibold text-lads-blue">LinkedIn</Text>
        </Pressable>
        <Pressable className="flex-1 items-center rounded-xl border border-gray-300 bg-white py-2.5 active:opacity-80">
          <FontAwesome name="github" size={18} color="#111827" />
          <Text className="mt-1 text-xs font-semibold text-forum-ink">GitHub</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onPressContratar?.(professional.id)}
          className="flex-1 items-center rounded-xl bg-lads-blue py-2.5 active:opacity-90">
          <FontAwesome name="briefcase" size={16} color="#FFFFFF" />
          <Text className="mt-1 text-xs font-semibold text-white">Contratar</Text>
        </Pressable>
      </View>
    </View>
  );
}
