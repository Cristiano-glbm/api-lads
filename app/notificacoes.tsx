import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_PURPLE = '#432DD7';

type NotifCategoria = 'evento' | 'mentoria' | 'servico' | 'forum' | 'sistema';

interface Notificacao {
  id: number;
  categoria: NotifCategoria;
  titulo: string;
  descricao: string;
  tempo: string;
  lida: boolean;
}

const NOTIFICACOES_MOCK: Notificacao[] = [
  {
    id: 1,
    categoria: 'evento',
    titulo: 'Hackathon Sprint — inscrições abertas!',
    descricao: 'As inscrições para o Hackathon Sprint (28/03 • 19h) foram abertas. Garanta sua vaga.',
    tempo: '5 min atrás',
    lida: false,
  },
  {
    id: 2,
    categoria: 'mentoria',
    titulo: 'Novo programa de mentoria 2026',
    descricao: 'O LADS lançou um novo programa de mentoria. Confira as vagas disponíveis.',
    tempo: '2h atrás',
    lida: false,
  },
  {
    id: 3,
    categoria: 'servico',
    titulo: 'Orçamento aprovado',
    descricao: 'O orçamento do seu serviço "Design de Logo" foi aprovado pelo cliente.',
    tempo: '4h atrás',
    lida: false,
  },
  {
    id: 4,
    categoria: 'forum',
    titulo: 'Nova resposta no seu post',
    descricao: 'Ana Paula respondeu ao seu post "Dúvida sobre React Native".',
    tempo: 'Ontem',
    lida: true,
  },
  {
    id: 5,
    categoria: 'evento',
    titulo: 'Workshop React — amanhã às 14h',
    descricao: 'Lembrete: você está inscrito no Workshop React (20/03 • 14h - 17h).',
    tempo: 'Ontem',
    lida: true,
  },
  {
    id: 6,
    categoria: 'sistema',
    titulo: 'Bem-vindo ao LADS!',
    descricao: 'Seu cadastro foi confirmado. Explore os recursos disponíveis.',
    tempo: '3 dias atrás',
    lida: true,
  },
];

const CATEGORIA_META: Record<NotifCategoria, { icon: string; cor: string; bg: string; label: string }> = {
  evento: { icon: '📅', cor: '#1D4ED8', bg: '#DBEAFE', label: 'Evento' },
  mentoria: { icon: '🤝', cor: '#7C3AED', bg: '#EDE9FE', label: 'Mentoria' },
  servico: { icon: '🛠️', cor: '#065F46', bg: '#D1FAE5', label: 'Serviço' },
  forum: { icon: '💬', cor: '#92400E', bg: '#FEF3C7', label: 'Fórum' },
  sistema: { icon: '🔔', cor: '#374151', bg: '#F3F4F6', label: 'Sistema' },
};

const CARD_SHADOW_WEB = { boxShadow: '0 1px 3px 0 rgba(0,0,0,0.08)' } as const;
const CARD_SHADOW_NATIVE = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
} as const;

function NotifCard({
  notif,
  onPress,
}: {
  notif: Notificacao;
  onPress: (id: number) => void;
}) {
  const meta = CATEGORIA_META[notif.categoria];
  return (
    <Pressable
      onPress={() => onPress(notif.id)}
      android_ripple={{ color: 'rgba(67,45,215,0.06)' }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: pressed ? '#F5F3FF' : notif.lida ? '#FFFFFF' : '#F0EEFF',
        borderRadius: 14,
        borderWidth: 1.067,
        borderColor: notif.lida ? '#F3F4F6' : '#C7BFFF',
        padding: 14,
        ...(Platform.OS === 'web' ? CARD_SHADOW_WEB : CARD_SHADOW_NATIVE),
      })}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: meta.bg,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
        <Text style={{ fontSize: 20 }}>{meta.icon}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <View
            style={{
              backgroundColor: meta.bg,
              borderRadius: 4,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}>
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 10,
                color: meta.cor,
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
              }}>
              {meta.label}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 11,
              color: '#9CA3AF',
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            }}>
            {notif.tempo}
          </Text>
          {!notif.lida && (
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                backgroundColor: '#FF8487',
                marginLeft: 2,
              }}
            />
          )}
        </View>
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 13,
            lineHeight: 18,
            color: '#111827',
            ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
          }}>
          {notif.titulo}
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 12,
            lineHeight: 17,
            color: '#6B7280',
            ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
          }}
          numberOfLines={2}>
          {notif.descricao}
        </Text>
      </View>
    </Pressable>
  );
}

export default function NotificacoesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notificacao[]>(NOTIFICACOES_MOCK);

  const naoLidas = notifs.filter((n) => !n.lida).length;

  function marcarLida(id: number) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }

  function marcarTodasLidas() {
    setNotifs((prev) => prev.map((n) => ({ ...n, lida: true })));
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ flex: 1, minHeight: 0, width: '100%', maxWidth: 448, alignSelf: 'center' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: HEADER_PURPLE,
          paddingTop: insets.top,
          ...(Platform.OS === 'web'
            ? { boxShadow: '0 2px 4px rgba(0,0,0,0.12)' }
            : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 3, elevation: 4 }),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 56,
            paddingHorizontal: 16,
            width: '100%',
          }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text
            style={{
              flex: 1,
              fontFamily: 'Inter_700Bold',
              fontSize: 16,
              lineHeight: 24,
              color: '#FFFFFF',
              marginLeft: 8,
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            }}>
            Notificações
            {naoLidas > 0 && (
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                {'  '}({naoLidas} novas)
              </Text>
            )}
          </Text>
          {naoLidas > 0 && (
            <Pressable
              onPress={marcarTodasLidas}
              hitSlop={8}
              style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.85)',
                  ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                }}>
                Marcar todas
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Lista */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: '100%',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 24) + 16,
          gap: 10,
        }}>
        {notifs.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 12 }}>
            <Text style={{ fontSize: 48 }}>🔕</Text>
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                color: '#374151',
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
              }}>
              Sem notificações
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#9CA3AF',
                textAlign: 'center',
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
              }}>
              Você está em dia com tudo!
            </Text>
          </View>
        ) : (
          notifs.map((notif) => (
            <NotifCard key={notif.id} notif={notif} onPress={marcarLida} />
          ))
        )}
      </ScrollView>
      </View>
    </View>
  );
}
