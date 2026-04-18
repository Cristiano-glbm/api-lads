import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav } from '@/components/forum/ForumBottomNav';
import { ForumDualHeaderBar } from '@/components/forum/ForumDualHeaderBar';
import { crossAlert } from '@/utils/crossAlert';

/** Acento botões / abas — Inspect Figma «Confirmar Inscrição» */
const EVENT_ACCENT = '#4F39F6';
/** Aba ativa (texto + sublinhado) — Inspect Figma «Sobre» */
const EVENT_TAB_ACTIVE = '#4F39F8';
/** Aba inativa — Inspect Figma (ex.: «Conteúdo» com «Membros» ativo) */
const EVENT_TAB_INACTIVE = '#8A72B2';
/** Preenchimento barra de progresso — Inspect Figma */
const EVENT_PROGRESS_FILL = '#4B15FF';
/** Cartão «Sobre o Evento» — Inspect Figma */
const EVENT_SOBRE_TITLE = '#112939';
const EVENT_SOBRE_BODY = '#4A5565';
const EVENT_SOBRE_META = '#4A5568';
const EVENT_SOBRE_VAGAS_HINT = '#88A1AF';

const EVENT_SOBRE_ICON_SIZE = 24;

/** Linha da lista Membros — Inspect Figma (frame ~65px, padding 12) */
const MEMBRO_ROW_MIN_HEIGHT = 65;
const MEMBRO_ROW_PADDING = 12;
const MEMBRO_ROW_SEPARATOR = 1.07;

/** Botão «Ver» na lista Membros — Inspect Figma */
const MEMBRO_VER_TEXT = '#4F38F6';
const MEMBRO_VER_BORDER = '#A3B3FF';

/** Aba Conteúdo — Inspect Figma (cartão, autor, stats, placeholders) */
const EVENT_CONTEUDO_CARD_BORDER = '#F3F4F8';
const EVENT_CONTEUDO_AVATAR_BG = '#F0F7FF';
const EVENT_CONTEUDO_AVATAR_INK = '#432DD7';
const EVENT_CONTEUDO_AUTHOR_NAME = '#112939';
const EVENT_CONTEUDO_TIME = '#1E2939';
const EVENT_CONTEUDO_LIKE_COUNT = '#112939';
const EVENT_CONTEUDO_COMMENT_COUNT = '#1E2B39';
const EVENT_CONTEUDO_POST_BODY = '#1E2B39';
const EVENT_CONTEUDO_STAT_ICON = 18;
const EVENT_PLACEHOLDER_BG = '#808080';
const EVENT_PLACEHOLDER_BORDER = '#E8E8E8';
const EVENT_PLACEHOLDER_RADIUS = 14;
const EVENT_PLACEHOLDER_HEIGHT = 167;
const EVENT_PLACEHOLDER_BORDER_W = 1.07;

const eventoImagemPlaceholderShadow =
  Platform.OS === 'web'
    ? { boxShadow: '0 1px 2px -1px rgba(0, 0, 0, 0.10)' }
    : Platform.OS === 'ios'
      ? {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }
      : { elevation: 2 };

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
    emoji: '📚', bgColor: '#DCFCE7', title: 'Seminário',
    date: '28/03/2026', time: '19h00 - 21h00',
    location: 'Auditório Principal - Bloco A',
    inscritos: 89, capacidade: 120,
    descricao: 'Palestras e mesas de debate com convidados e a comunidade LADS. Traga dúvidas e participe das discussões.',
  },
  '10': {
    emoji: '🏆', bgColor: '#FFFBE8', title: 'Hackathon Sprint',
    date: '28/03/2026', time: '19h00 - 21h00',
    location: 'Laboratório LADS - Arena Principal',
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
  const [inscrito, setInscrito] = useState(false);

  const evento  = EVENTOS_DETAIL[id ?? '1'] ?? EVENTOS_DETAIL['1'];
  const vagas   = evento.capacidade - evento.inscritos;
  const progress = evento.inscritos / evento.capacidade;

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ flex: 1, minHeight: 0, width: '100%', maxWidth: 448, alignSelf: 'center' }}>
      <ForumDualHeaderBar
        paddingTop={insets.top}
        screenTitle={`${evento.title} - Eventos`}
        eventName={evento.title}
        dateLabel={evento.date}
        subscribers={evento.inscritos}
        onBack={() => router.back()}
        contentInsetRight={Math.max(insets.right, 16)}
      />

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
                paddingVertical: 12,
                borderBottomWidth: 2,
                borderBottomColor: isActive ? EVENT_TAB_ACTIVE : 'transparent',
              }}>
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  lineHeight: 16,
                  letterSpacing: 0,
                  color: isActive ? EVENT_TAB_ACTIVE : EVENT_TAB_INACTIVE,
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
              <Text
                style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 14,
                  lineHeight: 20,
                  color: EVENT_SOBRE_TITLE,
                  marginBottom: 10,
                }}>
                Sobre o Evento
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 12,
                  lineHeight: 19.5,
                  color: EVENT_SOBRE_BODY,
                  marginBottom: 18,
                }}>
                {evento.descricao}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Image
                  accessibilityRole="image"
                  accessibilityLabel="Data e horário"
                  source={require('../assets/images/evento-icon-calendario.png')}
                  style={{ width: EVENT_SOBRE_ICON_SIZE, height: EVENT_SOBRE_ICON_SIZE }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    lineHeight: 16,
                    color: EVENT_SOBRE_META,
                    flex: 1,
                  }}>
                  {evento.date} • {evento.time}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Image
                  accessibilityRole="image"
                  accessibilityLabel="Local"
                  source={require('../assets/images/evento-icon-local.png')}
                  style={{ width: EVENT_SOBRE_ICON_SIZE, height: EVENT_SOBRE_ICON_SIZE }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    lineHeight: 16,
                    color: EVENT_SOBRE_META,
                    flex: 1,
                  }}>
                  {evento.location}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <Image
                  accessibilityRole="image"
                  accessibilityLabel="Inscrições"
                  source={require('../assets/images/inscritos-grupo-figma.png')}
                  style={{ width: EVENT_SOBRE_ICON_SIZE, height: EVENT_SOBRE_ICON_SIZE }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    lineHeight: 16,
                    color: EVENT_SOBRE_META,
                    flex: 1,
                  }}>
                  {evento.inscritos}/{evento.capacidade} inscritos
                </Text>
              </View>

              {/* Barra de progresso */}
              <View style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden' }}>
                <View
                  style={{
                    height: 8,
                    width: `${Math.round(progress * 100)}%` as any,
                    backgroundColor: EVENT_PROGRESS_FILL,
                    borderRadius: 999,
                  }}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 12,
                  lineHeight: 16,
                  color: EVENT_SOBRE_VAGAS_HINT,
                  textAlign: 'right',
                  marginTop: 6,
                }}>
                {vagas} vagas restantes
              </Text>
            </View>

            <Pressable
              android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
              onPress={() => setInscrito((v) => !v)}
              style={{
                backgroundColor: inscrito ? '#FFFFFF' : EVENT_ACCENT,
                borderRadius: 14,
                minHeight: 44,
                paddingVertical: 12,
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                borderWidth: inscrito ? 1.5 : 0,
                borderColor: EVENT_ACCENT,
              }}>
              <Text style={{ fontSize: 14, lineHeight: 20 }}>{inscrito ? '✅' : '📋'}</Text>
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 14,
                  lineHeight: 20,
                  letterSpacing: 0,
                  color: inscrito ? EVENT_ACCENT : '#FFFFFF',
                }}>
                {inscrito ? 'Inscrito — Cancelar?' : 'Confirmar Inscrição'}
              </Text>
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
                  minHeight: MEMBRO_ROW_MIN_HEIGHT,
                  padding: MEMBRO_ROW_PADDING,
                  borderBottomWidth: idx < MEMBROS_MOCK.length - 1 ? MEMBRO_ROW_SEPARATOR : 0,
                  borderBottomColor: '#E5E7EB',
                }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#E8EDFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: EVENT_TAB_ACTIVE }}>{m.initials}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: 'Inter_700Bold', fontSize: 14, lineHeight: 20, color: '#111827' }}>
                    {m.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                      lineHeight: 16,
                      color: '#9CA3AF',
                      marginTop: 2,
                    }}>
                    {m.role}
                  </Text>
                </View>
                <Pressable
                  android_ripple={{ color: 'rgba(79,57,246,0.12)' }}
                  style={({ pressed }) => ({
                    borderRadius: 10,
                    borderWidth: MEMBRO_ROW_SEPARATOR,
                    borderColor: MEMBRO_VER_BORDER,
                    paddingTop: 6,
                    paddingRight: 9,
                    paddingBottom: 4,
                    paddingLeft: 10,
                    minWidth: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pressed ? 'rgba(163,179,255,0.15)' : '#FFFFFF',
                  })}>
                  <Text
                    style={{
                      fontFamily: 'Inter_500Medium',
                      fontSize: 12,
                      lineHeight: 16,
                      letterSpacing: 0,
                      color: MEMBRO_VER_TEXT,
                    }}>
                    Ver
                  </Text>
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
                onPress={() =>
                  crossAlert(
                    'Adicionar conteúdo',
                    'Em breve você poderá compartilhar fotos e textos do evento diretamente aqui. Fique atento às novidades! 🚀',
                    [{ text: 'Entendido', style: 'default' }],
                  )
                }
                style={{
                  backgroundColor: EVENT_ACCENT,
                  width: 160,
                  minHeight: 40,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 14,
                    lineHeight: 20,
                    letterSpacing: 0,
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}>
                  Adicionar conteúdo
                </Text>
              </Pressable>
            </View>

            {CONTEUDOS_MOCK.map((post) => (
              <View
                key={post.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: EVENT_PLACEHOLDER_RADIUS,
                  padding: 14,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: EVENT_CONTEUDO_CARD_BORDER,
                  shadowColor: '#000',
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }}>
                {/* Autor — Inspect Figma (avatar 32, PA #432DD7, nome 12/600 #112939, tempo 10 #1E2939) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: EVENT_CONTEUDO_AVATAR_BG,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Inter_700Bold',
                        fontSize: 12,
                        lineHeight: 16,
                        color: EVENT_CONTEUDO_AVATAR_INK,
                      }}>
                      {post.initials}
                    </Text>
                  </View>
                  {/* Figma: «Nome · tempo» colado à esquerda; não esticar o nome (evita tempo encostado à direita) */}
                  <View
                    style={{
                      flex: 1,
                      minWidth: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: 6,
                    }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 12,
                        lineHeight: 20,
                        color: EVENT_CONTEUDO_AUTHOR_NAME,
                        flexShrink: 1,
                      }}>
                      {post.name}
                    </Text>
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' }} />
                    <Text
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 10,
                        lineHeight: 20,
                        color: EVENT_CONTEUDO_TIME,
                        flexShrink: 0,
                      }}>
                      {post.time}
                    </Text>
                  </View>
                </View>

                {/* Texto do post — Inspect Figma */}
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    lineHeight: 20,
                    letterSpacing: 0,
                    color: EVENT_CONTEUDO_POST_BODY,
                    marginBottom: 12,
                  }}>
                  {post.text}
                </Text>

                {/* Imagens placeholder — Inspect Figma (#808080, borda #E8E8E8, raio 14, altura 167) */}
                {post.imageCount === 1 ? (
                  <View
                    style={{
                      width: '100%',
                      height: EVENT_PLACEHOLDER_HEIGHT,
                      backgroundColor: EVENT_PLACEHOLDER_BG,
                      borderRadius: EVENT_PLACEHOLDER_RADIUS,
                      borderWidth: EVENT_PLACEHOLDER_BORDER_W,
                      borderColor: EVENT_PLACEHOLDER_BORDER,
                      marginBottom: 12,
                      ...eventoImagemPlaceholderShadow,
                    }}
                  />
                ) : (
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                    {Array.from({ length: post.imageCount }).map((_, i) => (
                      <View
                        key={i}
                        style={{
                          flex: 1,
                          height: EVENT_PLACEHOLDER_HEIGHT,
                          backgroundColor: EVENT_PLACEHOLDER_BG,
                          borderRadius: EVENT_PLACEHOLDER_RADIUS,
                          borderWidth: EVENT_PLACEHOLDER_BORDER_W,
                          borderColor: EVENT_PLACEHOLDER_BORDER,
                          ...eventoImagemPlaceholderShadow,
                        }}
                      />
                    ))}
                  </View>
                )}

                {/* Likes e comentários — Inspect Figma (ícones 18×18; contagens 12/400) */}
                <View style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <FontAwesome name="heart-o" size={EVENT_CONTEUDO_STAT_ICON} color={EVENT_CONTEUDO_LIKE_COUNT} />
                    <Text
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                        lineHeight: 20,
                        color: EVENT_CONTEUDO_LIKE_COUNT,
                      }}>
                      {post.likes}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <FontAwesome name="comment-o" size={EVENT_CONTEUDO_STAT_ICON} color={EVENT_CONTEUDO_COMMENT_COUNT} />
                    <Text
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                        lineHeight: 20,
                        color: EVENT_CONTEUDO_COMMENT_COUNT,
                      }}>
                      {post.comments}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <ForumBottomNav active="eventos" accent="purple" />
      </View>
    </View>
  );
}
