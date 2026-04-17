import { Pressable, Text } from 'react-native';

export interface ProfessionalFilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function ProfessionalFilterChip({ label, active, onPress }: ProfessionalFilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`mr-2 rounded-full border px-4 py-2 ${
        active ? 'border-lads-blue bg-lads-blue' : 'border-gray-300 bg-white'
      }`}>
      <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-forum-ink'}`}>{label}</Text>
    </Pressable>
  );
}
