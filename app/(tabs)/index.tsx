import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View className="flex-1 justify-center gap-3 bg-forum-bg px-6 py-8">
      <Text className="text-center text-base text-forum-muted">Projeto LADS — atalhos (dev)</Text>
      <Link href="/servicos" asChild>
        <Pressable className="rounded-xl bg-lads-header px-6 py-3 active:opacity-90">
          <Text className="text-center text-base font-semibold text-white">Serviços</Text>
        </Pressable>
      </Link>

      <Link href="/profissionais" asChild>
        <Pressable className="rounded-xl bg-lads-header-deep px-6 py-3 active:opacity-90">
          <Text className="text-center text-base font-semibold text-white">Profissionais</Text>
        </Pressable>
      </Link>

      <Link href="/perfil-profissional" asChild>
        <Pressable className="rounded-xl border-2 border-lads-blue bg-white px-6 py-3 active:opacity-90">
          <Text className="text-center text-base font-semibold text-lads-blue">Perfil profissional</Text>
        </Pressable>
      </Link>

      <Link href="/forum" asChild>
        <Pressable className="rounded-xl bg-forum-primary px-6 py-3 active:opacity-90">
          <Text className="text-center text-base font-semibold text-white">ForumHome</Text>
        </Pressable>
      </Link>
      
    </View>
  );
}
