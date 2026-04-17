import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav } from '@/components/forum/ForumBottomNav';
import { LadsTopBar } from '@/components/lads/LadsTopBar';

const EVENTOS = [
  { id: 1, emoji: '🌙', bgColor: '#EDE9FE', title: 'Noite Sem Pijama', date: '15/03 • Noite inteira', inscritos: 234 },
  { id: 2, emoji: '💻', bgColor: '#F3F4F6', title: 'Workshop React', date: '20/03 • 14h - 17h', inscritos: 45 },
  { id: 3, emoji: '🏆', bgColor: '#FEF9C3', title: 'Hackathon Sprint', date: '28/03 • 19h - 21h', inscritos: 89 },
];

const NOTICIAS = [
  { id: 1, emoji: '🤝', title: 'LADS lança novo programa de mentoria para 2026', tag: 'Institucional', tagColor: '#7C3AED', tagBg: '#EDE9FE', tempo: '2h atrás' },
  { id: 2, emoji: '🎯', title: 'Hackathon Sprint abre inscrições com prêmios incríveis', tag: 'Evento', tagColor: '#1D4ED8', tagBg: '#DBEAFE', tempo: '5h atrás' },
];

function EventoCard({ evento }: { evento: (typeof EVENTOS)[0] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
      <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: evento.bgColor, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
        <Text style={{ fontSize: 22 }}>{evento.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>{evento.title}</Text>
        <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{evento.date}</Text>
        <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>👥 {evento.inscritos} inscritos</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 6, width: 144 }}>
        <Pressable android_ripple={{ color: 'rgba(255,255,255,0.25)' }} style={{ flex: 1, backgroundColor: '#4F46E5', borderRadius: 8, paddingVertical: 6, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Inscrever</Text>
        </Pressable>
        <Pressable android_ripple={{ color: 'rgba(255,255,255,0.2)' }} style={{ flex: 1, backgroundColor: '#6B7280', borderRadius: 8, paddingVertical: 6, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Detalhes</Text>
        </Pressable>
      </View>
    </View>
  );
}

function NoticiaCard({ noticia }: { noticia: (typeof NOTICIAS)[0] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 10 }}>
      <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18 }}>{noticia.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827', lineHeight: 18 }}>{noticia.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
          <View style={{ backgroundColor: noticia.tagBg, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: noticia.tagColor }}>{noticia.tag}</Text>
          </View>
          <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{noticia.tempo}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#432DD7', paddingTop: insets.top }}>
        <LadsTopBar variant="servicos-figma" />
        {/* User greeting */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#818CF8', alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome name="user" size={22} color="#fff" />
            </View>
            <View>
              <Text style={{ color: '#C7D2FE', fontSize: 13 }}>Olá, 👋</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Bem-vindo, João!</Text>
              <Text style={{ color: '#A5B4FC', fontSize: 11, marginTop: 1 }}>Laboratório de Aplicações e Desenvolvimento de Software</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        {/* Próximos Eventos */}
        <View style={{ backgroundColor: '#fff', margin: 14, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#374151', letterSpacing: 0.5, marginBottom: 12 }}>🗓️ PRÓXIMOS EVENTOS DO LADS</Text>
          {EVENTOS.map((evento) => <EventoCard key={evento.id} evento={evento} />)}
          <Pressable onPress={() => router.push('/eventos')} style={{ alignItems: 'center', marginTop: 4 }}>
            <Text style={{ color: '#4F46E5', fontSize: 13, fontWeight: '600' }}>Ver Todos os Eventos &gt;</Text>
          </Pressable>
        </View>

        {/* Últimas Notícias */}
        <View style={{ backgroundColor: '#fff', marginHorizontal: 14, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#374151', letterSpacing: 0.5, marginBottom: 4 }}>📰 ÚLTIMAS NOTÍCIAS</Text>
          {NOTICIAS.map((noticia) => <NoticiaCard key={noticia.id} noticia={noticia} />)}
        </View>

        {/* Acesso Rápido */}
        <View style={{ backgroundColor: '#fff', margin: 14, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#374151', letterSpacing: 0.5, marginBottom: 12 }}>⚡ ACESSO RÁPIDO</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={() => router.push('/servicos')} style={({ pressed }) => ({ flex: 1, backgroundColor: pressed ? '#E5E7EB' : '#F9FAFB', borderRadius: 12, paddingVertical: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#E5E7EB' })}>
              <FontAwesome5 name="tools" size={22} color="#4F46E5" />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>Serviços</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/profissionais')} style={({ pressed }) => ({ flex: 1, backgroundColor: pressed ? '#E5E7EB' : '#F9FAFB', borderRadius: 12, paddingVertical: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#E5E7EB' })}>
              <FontAwesome name="users" size={22} color="#7C3AED" />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>Profis.</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/forum')} style={({ pressed }) => ({ flex: 1, backgroundColor: pressed ? '#E5E7EB' : '#F9FAFB', borderRadius: 12, paddingVertical: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#E5E7EB' })}>
              <FontAwesome name="comments" size={22} color="#0EA5E9" />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>Fórum</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ForumBottomNav active="inicio" accent="purple" />
    </View>
  );
}
