import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
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
      <View style={{ backgroundColor: '#432DD7', paddingTop: insets.top }}>
        <LadsTopBar variant="servicos-figma" />
        <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 18 }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>👥 Profissionais LADS</Text>
          <Text style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13, marginTop: 3 }}>Conecte-se com especialistas da nossa comunidade</Text>
        </View>
      </View>

      <View className="px-4 pt-4">
        <View className="flex-row items-center rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <Text className="mr-2 text-forum-muted">🔍</Text>
          <TextInput
            className="flex-1 text-base text-forum-ink"
            placeholder="Buscar profissionais..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-14 flex-grow-0 pt-3"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}>
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
  );
}
