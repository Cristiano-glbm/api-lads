import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav } from '@/components/forum/ForumBottomNav';

const BAR_BG = '#432DD7';
type Tab = 'sobre' | 'membros' | 'conteudo';

// ─── Mock data ────────────────────────────────────────────────────────────────

const EVENTOS_DETAIL: Record<string, {
  emoji: string; bgColor: string; title: string;
  date: string; time: string; location: string;
  inscritos: number; capacidade: number; descricao: string;
}> = {
  '1': {
    emoji: '🌙', bgColor: '#EDE9FE', title: 'Noite Sem Pijama',
    date: '15/03/2026', time: '22h00 - 06h00',
    location: 'Laboratório LADS - Bloco B',
    inscritos: 234, capacidade: 250,
    descricao: 'A Noite Sem Pijama é o evento mais aguardado do LADS! Uma noite inteira de hackathon, networking e muito café ☕.',
  },
  '2': {
    emoji: '💻', bgColor: '#F3F4F6', title: 'Workshop React',
    date: '20/03/2026', time: '14h00 - 17h00',
    location: 'Laboratório LADS - Sala 3',
    inscritos: 45, capacidade: 60,
    descricao: 'Aprenda React na prática com os membros do LADS. Workshop focado em hooks, componentes e boas práticas de desenvolvimento.',
  },
  '3': {
    emoji: '🏆', bgColor: '#FEF9C3', title: 'Hackathon Sprint',
    date: '28/03/2026', time: '19h00 - 21h00',
    location: 'Auditório Principal - Bloco A',
    inscritos: 89, capacidade: 120,
    descricao: 'Competição de programação com prêmios incríveis. Forme seu time, escolha um desafio e mostre suas habilidades!',
  },
  '4': {
    emoji: '🎨', bgColor: '#FCE7F3', title: 'UI/UX Design Day',
    date: '05/04/2026', time: '09h00 - 13h00',
    location: 'Laboratório LADS - Design Lab',
    inscritos: 61, capacidade: 80,
    descricao: 'Workshop de design de interfaces e UX com especialistas da área. Aprenda prototipação no Figma e princípios de design.',
  },
  '5': {
    emoji: '🤖', bgColor: '#ECFDF5', title: 'IA na Prática',
    date: '12/04/2026', time: '15h00 - 18h00',
    location: 'Laboratório LADS - Bloco A',
    inscritos: 120, capacidade: 150,
    descricao: 'Explore inteligência artificial e machine learning com cases reais do LADS. Modelos, pipelines e muito código.',
  },
  '6': {
    emoji: '📱', bgColor: '#E0F2FE', title: 'Dev Mobile Day',
    date: '18/04/2026', time: '10h00 - 16h00',
    location: 'Laboratório LADS - Mobile Lab',
    inscritos: 73, capacidade: 100,
    descricao: 'React Native e Expo do básico ao avançado. Construa e publique seu primeiro app mobile ao longo do dia.',
  },
};

const MEMBROS_MOCK = [
  { initials: 'JS', name: 'João Silva',        role: 'Organizador'  },
  { initials: 'MS', name: 'Maria Santos',       role: 'Participante' },
  { initials: 'CO', name: 'Carlos Oliveira',    role: 'Mentor'       },
  { initials: 'FR', name: 'Fernanda Rodrigues', role: 'Participante' },
  { initials: 'PA', name: 'Pedro Alves',        role: 'Participante' },
];

const CONTEUDOS_MOCK = [
  { id: 1, initials: 'PA', name: 'Pedro Alves',        time: '1h',    text: 'Esse evento foi incrível, quero voltar mais vezes!',         imageCount: 1, likes: 123, comments: 23 },
  { id: 2, initials: 'FR', name: 'Fernanda Rodrigues', time: '35min', text: 'Achei o conteúdo dessa oficina de Python, o melhor de todos.', imageCount: 2, likes: 45,  comments: 8  },
];

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'sobre',    label: 'Sobre',    emoji: '🚀' },
  { id: 'membros',  label: 'Membros',  emoji: '👥' },
  { id: 'conteudo', label: 'Conteúdo', emoji: '📷' },
];

// ─── Tela ─────────────────────────────────────────────────────────────────────

export default function EventoDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('sobre');

  const evento  = EVENTOS_DETAIL[id ?? '1'] ?? EVENTOS_DETAIL['1'];
  const vagas   = evento.capacidade - evento.inscritos;
  const progress = evento.inscritos / evento.capacidade;

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>

      {/* ── Header roxo ── */}
      <View style={{ backgroundColor: BAR_BG, paddingTop: insets.top }}>
        {/* Barra de navegação */}
        <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome name="arrow-left" size={18} color="#fff" />
          </Pressable>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff', flex: 1 }} numberOfLines={1}>
            {evento.title} - Eventos
          </Text>
        </View>

        {/* Banner do evento */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: evento.bgColor, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }}>{evento.emoji}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' }}>{evento.title}</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#C7D2FE', marginTop: 2 }}>
              {evento.date} • {evento.inscritos} inscritos
            </Text>
          </View>
        </View>
      </View>

      {/* ── Abas ── */}
      <View style={{ backgroundColor: '#fff', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 14,
                borderBottomWidth: 2,
                borderBottomColor: isActive ? '#4F46E5' : 'transparent',
              }}>
              <Text style={{
                fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular',
                fontSize: 13,
                color: isActive ? '#4F46E5' : '#6B7280',
              }}>
                {tab.emoji} {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Conteúdo ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>

        {/* ─── Aba Sobre ─── */}
        {activeTab === 'sobre' && (
          <>
            <View style={{
              backgroundColor: '#fff', borderRadius: 14, padding: 16,
              borderWidth: 1, borderColor: '#F3F4F6',
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
              marginBottom: 16,
            }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111827', marginBottom: 10 }}>
                Sobre o Evento
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#374151', lineHeight: 21, marginBottom: 18 }}>
                {evento.descricao}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Text style={{ fontSize: 20 }}>📅</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#374151' }}>
                  {evento.date} • {evento.time}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Text style={{ fontSize: 20 }}>📍</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#374151' }}>
                  {evento.location}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <Text style={{ fontSize: 20 }}>👥</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#374151' }}>
                  {evento.inscritos}/{evento.capacidade} inscritos
                </Text>
              </View>

              {/* Barra de progresso */}
              <View style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden' }}>
                <View style={{ height: 8, width: `${Math.round(progress * 100)}%` as any, backgroundColor: '#4F46E5', borderRadius: 999 }} />
              </View>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9CA3AF', textAlign: 'right', marginTop: 6 }}>
                {vagas} vagas restantes
              </Text>
            </View>

            <Pressable
              android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
              style={{ backgroundColor: '#4F46E5', borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' }}>✅ Confirmar Inscrição</Text>
            </Pressable>
          </>
        )}

        {/* ─── Aba Membros ─── */}
        {activeTab === 'membros' && (
          <View style={{
            backgroundColor: '#fff', borderRadius: 14,
            borderWidth: 1, borderColor: '#F3F4F6',
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
            overflow: 'hidden',
          }}>
            {MEMBROS_MOCK.map((m, idx) => (
              <View
                key={m.name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderTopWidth: idx === 0 ? 0 : 1,
                  borderTopColor: '#F3F4F6',
                }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: '#4F46E5' }}>{m.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#111827' }}>{m.name}</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{m.role}</Text>
                </View>
                <Pressable style={({ pressed }) => ({
                  borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB',
                  paddingHorizontal: 16, paddingVertical: 6,
                  backgroundColor: pressed ? '#F9FAFB' : '#fff',
                })}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#374151' }}>Ver</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* ─── Aba Conteúdo ─── */}
        {activeTab === 'conteudo' && (
          <>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Pressable
                android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
                style={{ backgroundColor: '#4F46E5', borderRadius: 20, paddingHorizontal: 28, paddingVertical: 11 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#fff' }}>Adicionar conteúdo</Text>
              </Pressable>
            </View>

            {CONTEUDOS_MOCK.map((post) => (
              <View key={post.id} style={{
                backgroundColor: '#fff', borderRadius: 14, padding: 14,
                marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6',
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
              }}>
                {/* Autor */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: '#4F46E5' }}>{post.initials}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827' }}>{post.name}</Text>
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#9CA3AF' }} />
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280' }}>{post.time}</Text>
                </View>

                {/* Texto */}
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 12 }}>
                  {post.text}
                </Text>

                {/* Imagens placeholder */}
                {post.imageCount === 1 ? (
                  <View style={{ height: 160, backgroundColor: '#D1D5DB', borderRadius: 10, marginBottom: 12 }} />
                ) : (
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                    {Array.from({ length: post.imageCount }).map((_, i) => (
                      <View key={i} style={{ flex: 1, height: 120, backgroundColor: '#D1D5DB', borderRadius: 10 }} />
                    ))}
                  </View>
                )}

                {/* Likes e comentários */}
                <View style={{ flexDirection: 'row', gap: 18 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <FontAwesome name="heart-o" size={16} color="#374151" />
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#374151' }}>{post.likes}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <FontAwesome name="comment-o" size={16} color="#374151" />
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#374151' }}>{post.comments}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <ForumBottomNav active="eventos" accent="purple" />
    </View>
  );
}
