import { FontAwesome } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PROFESSIONALS_LIST } from '@/constants/professionalsMock';
import type { ProfessionalFilterId } from '@/types/professional';

import { ForumBottomNav } from '../forum/ForumBottomNav';
import { LadsTopBar } from '../lads/LadsTopBar';
import { ProfessionalCard } from './ProfessionalCard';
import { ProfessionalFilterChip } from './ProfessionalFilterChip';

const FILTERS: { id: ProfessionalFilterId; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'ia', label: 'IA' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'devops', label: 'DevOps' },
  { id: 'design', label: 'Design' },
];

export interface ProfessionalsScreenProps {
  onPressContratar?: (id: string) => void;
}

export function ProfessionalsScreen({ onPressContratar }: ProfessionalsScreenProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ProfessionalFilterId>('todos');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROFESSIONALS_LIST;
    return PROFESSIONALS_LIST.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.affiliation.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <View className="flex-1 bg-forum-bg">
      <View style={{ flex: 1, minHeight: 0, width: '100%', maxWidth: 448, alignSelf: 'center' }}>
      <View style={{ backgroundColor: '#432DD7', paddingTop: insets.top }}>
        <LadsTopBar variant="servicos-figma" />
        <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 18 }}>
          <Text
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: 16,
              lineHeight: 24,
              color: '#FFFFFF',
              ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
            }}>
            👥 Profissionais LADS
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              lineHeight: 16,
              color: '#C6D2FF',
              marginTop: 3,
              ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
            }}>
            Conecte-se com especialistas da nossa comunidade
          </Text>
        </View>
      </View>

      <View className="px-4 pt-4">
        <View
          className="flex-row items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm"
          style={{ minHeight: 48, paddingVertical: 12 }}>
          <FontAwesome name="search" size={16} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            className="flex-1 text-base text-forum-ink"
            placeholder="Buscar profissionais..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            {...(Platform.OS === 'android'
              ? { textAlignVertical: 'center' as const, includeFontPadding: false as const }
              : {})}
            style={{ paddingVertical: 0, margin: 0 }}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        alwaysBounceHorizontal={false}
        style={{ width: '100%', flexGrow: 0, paddingTop: 12 }}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingLeft: 16,
          paddingRight: 28,
          paddingBottom: 12,
        }}>
        {FILTERS.map((f) => (
          <ProfessionalFilterChip
            key={f.id}
            label={f.label}
            active={filter === f.id}
            onPress={() => setFilter(f.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}>
        {list.map((p) => (
          <ProfessionalCard key={p.id} professional={p} onPressContratar={onPressContratar} />
        ))}
      </ScrollView>

      <ForumBottomNav active="profis" accent="blue" />
      </View>
    </View>
  );
}
