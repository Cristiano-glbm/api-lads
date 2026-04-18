import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav, FORUM_BOTTOM_NAV_ROW_HEIGHT } from '@/components/forum/ForumBottomNav';
import { LadsTopBar } from '@/components/lads/LadsTopBar';

const PAGE_BG = '#F9FAFB';
const HEADER_PURPLE = '#432DD7';
const CTA_PURPLE = '#5B1CFA';
/** Inspect Figma — texto «Acesso rápido» (Inter 500, 12/16) */
const ACESSO_RAPIDO_LABEL_SERVICOS = '#432BD7';
const ACESSO_RAPIDO_LABEL_PROFIS = '#8200DB';
const ACESSO_RAPIDO_LABEL_FORUM = '#1447E6';
const ACESSO_RAPIDO_LABEL_TYPO = {
  fontFamily: 'Inter_500Medium',
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: 0,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
} as const;

const EVENTOS = [
  {
    id: 1,
    emoji: '🌙',
    title: 'Noite Sem Pijama',
    date: '15/03 • Noite inteira',
    inscritos: 234,
    cardBg: '#FAFAFF',
    cardBorder: '#E5E4FF',
  },
  {
    id: 2,
    emoji: '💻',
    title: 'Workshop React',
    date: '20/03 • 14h - 17h',
    inscritos: 45,
    cardBg: '#EFFBFF',
    cardBorder: '#B1D3FF',
  },
  /** Figma Home: destaque Hackathon (calendário/lista em Eventos usam Seminário no mesmo dia — ver `id` 10 vs 3). */
  {
    id: 10,
    emoji: '🏆',
    title: 'Hackathon Sprint',
    date: '28/03 • 19h - 21h',
    inscritos: 89,
    cardBg: '#FFFBE8',
    cardBorder: '#FEE6B5',
  },
] as const;

const NOTICIAS = [
  { id: 1, emoji: '🤝', title: 'LADS lança novo programa de mentoria para 2026', tag: 'Institucional', tagColor: '#7C3AED', tagBg: '#EDE9FE', tempo: '2h atrás' },
  { id: 2, emoji: '🎯', title: 'Hackathon Sprint abre inscrições com prêmios incríveis', tag: 'Evento', tagColor: '#1D4ED8', tagBg: '#DBEAFE', tempo: '5h atrás' },
] as const;

/** Sombra Figma (cartões brancos) — igual `ServicesScreen` categorias */
const CARD_SHADOW_WEB = { boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)' } as const;
const CARD_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
} as const;

const sectionShell = {
  width: '100%' as const,
  paddingTop: 16,
  paddingRight: 16,
  paddingBottom: 16,
  paddingLeft: 16,
  flexDirection: 'column' as const,
  alignItems: 'flex-start' as const,
  gap: 12,
  alignSelf: 'stretch' as const,
  borderRadius: 14,
  borderWidth: 1.067,
  borderColor: '#F3F4F6',
  backgroundColor: '#FFFFFF',
  ...(Platform.OS === 'web' ? CARD_SHADOW_WEB : CARD_SHADOW_NATIVE),
};

/** «Acesso rápido» — Figma: cartão branco ~16px; pastilhas interiores ~12px (menor que o contentor) */
const ACESSO_RAPIDO_SHELL = {
  ...sectionShell,
  borderRadius: 16,
} as const;
const ACESSO_RAPIDO_TILE_RADIUS = 12;

const sectionHeadingRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  alignSelf: 'stretch' as const,
  width: '100%' as const,
  gap: 6,
  minHeight: 22,
};

const sectionTitleTypo = {
  fontFamily: 'Inter_700Bold',
  fontSize: 14,
  lineHeight: 20,
  fontStyle: 'normal' as const,
  color: '#112939',
  letterSpacing: 0,
  textTransform: 'uppercase' as const,
  flex: 1,
  minWidth: 0,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
};

const sectionIconSlot = {
  width: 20,
  height: 20,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

function EventoCard({ evento }: { evento: (typeof EVENTOS)[number] }) {
  const router = useRouter();
  const [inscrito, setInscrito] = useState(false);

  return (
    <View
      style={{
        alignSelf: 'stretch',
        width: '100%',
        backgroundColor: evento.cardBg,
        borderRadius: 14,
        borderWidth: 1.067,
        borderColor: evento.cardBorder,
        padding: 12,
        gap: 12,
      }}>
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: 14,
          lineHeight: 20,
          color: '#0A0A0A',
          ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
        }}>
        <Text style={{ fontSize: 16 }}>{evento.emoji}</Text>
        <Text>{'  '}</Text>
        <Text>{evento.title}</Text>
      </Text>
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 12,
          lineHeight: 16,
          color: '#99A1AE',
          ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
        }}>
        {evento.date}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Image source={require('@/assets/images/inscritos-grupo-figma.png')} style={{ width: 14, height: 14 }} resizeMode="contain" />
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 12,
            lineHeight: 16,
            color: '#99A1AE',
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          }}>
          {evento.inscritos} inscritos
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch' }}>
        <Pressable
          android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
          onPress={() => setInscrito((v) => !v)}
          style={{
            flex: 1,
            minHeight: 36,
            backgroundColor: inscrito ? '#FFFFFF' : CTA_PURPLE,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: inscrito ? 1 : 0,
            borderColor: CTA_PURPLE,
            flexDirection: 'row',
            gap: 4,
          }}>
          {inscrito && <FontAwesome name="check" size={11} color={CTA_PURPLE} />}
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 12,
              lineHeight: 16,
              color: inscrito ? CTA_PURPLE : '#FFFFFF',
              ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
            }}>
            {inscrito ? 'Inscrito' : 'Inscrever'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: '/evento-detalhe', params: { id: String(evento.id) } })}
          android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          style={{
            flex: 1,
            minHeight: 36,
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            borderWidth: 1.07,
            borderColor: '#E6E7E8',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 12,
              lineHeight: 16,
              color: '#4A5568',
              ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
            }}>
            Detalhes
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function NoticiaCard({ noticia }: { noticia: (typeof NOTICIAS)[number] }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 10,
        alignSelf: 'stretch',
      }}>
      <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18 }}>{noticia.emoji}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 13,
            lineHeight: 18,
            color: '#111827',
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          }}>
          {noticia.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: noticia.tagBg, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: noticia.tagColor }}>{noticia.tag}</Text>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF' }}>{noticia.tempo}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const column448 = {
    width: '100%' as const,
    maxWidth: 448,
    alignSelf: 'center' as const,
  };

  const scrollBottomPad = 16 + FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 12);

  const greetingBlock = {
    ...column448,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 20,
    paddingLeft: 16,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: 2,
    backgroundColor: HEADER_PURPLE,
  };

  const greetingTitle = {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  };

  const greetingSub = {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#C6D2FF',
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <View style={{ flex: 1, minHeight: 0, width: '100%', maxWidth: 448, alignSelf: 'center' }}>
      <View style={{ backgroundColor: HEADER_PURPLE, paddingTop: insets.top }}>
        <LadsTopBar logoTint={HEADER_PURPLE} variant="servicos-figma" />
        <View style={greetingBlock}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch' }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#818CF8', alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome name="user" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={greetingSub}>Olá, 👋</Text>
              <Text style={greetingTitle}>Bem-vindo, João!</Text>
              <Text style={[greetingSub, { marginTop: 4 }]}>Laboratório de Aplicações e Desenvolvimento de Software</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: '100%',
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: scrollBottomPad,
          gap: 16,
        }}>
        <View style={sectionShell}>
          <Text
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: 14,
              lineHeight: 20,
              fontStyle: 'normal' as const,
              color: '#112939',
              letterSpacing: 0,
              alignSelf: 'stretch',
              ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
            }}>
            <Text style={{ fontSize: 16, lineHeight: 20 }}>📅</Text>
            <Text>{'  '}PRÓXIMOS EVENTOS DO LADS</Text>
          </Text>
          {EVENTOS.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
          <Pressable onPress={() => router.push('/eventos')} style={{ alignSelf: 'center', marginTop: 4 }}>
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 13,
                lineHeight: 18,
                color: CTA_PURPLE,
                ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
              }}>
              Ver Todos os Eventos &gt;
            </Text>
          </Pressable>
        </View>

        <View style={sectionShell}>
          <View style={sectionHeadingRow}>
            <View style={sectionIconSlot}>
              <FontAwesome name="newspaper-o" size={15} color="#99A1AE" />
            </View>
            <Text style={sectionTitleTypo}>Últimas notícias</Text>
          </View>
          {NOTICIAS.map((noticia) => (
            <NoticiaCard key={noticia.id} noticia={noticia} />
          ))}
        </View>

        <View style={ACESSO_RAPIDO_SHELL}>
          <View style={sectionHeadingRow}>
            <View style={sectionIconSlot}>
              <FontAwesome name="bolt" size={16} color="#99A1AE" />
            </View>
            <Text style={sectionTitleTypo}>Acesso rápido</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
            <Pressable
              onPress={() => router.push('/servicos')}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: pressed ? '#DBEAFE' : '#EFF6FF',
                borderRadius: ACESSO_RAPIDO_TILE_RADIUS,
                paddingVertical: 16,
                alignItems: 'center',
                gap: 6,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              })}>
              <Image source={require('@/assets/images/acesso-servicos-figma.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
              <Text style={{ ...ACESSO_RAPIDO_LABEL_TYPO, color: ACESSO_RAPIDO_LABEL_SERVICOS }}>Serviços</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/profissionais')}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: pressed ? '#EDE9FE' : '#F5F3FF',
                borderRadius: ACESSO_RAPIDO_TILE_RADIUS,
                paddingVertical: 16,
                alignItems: 'center',
                gap: 6,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              })}>
              <Image source={require('@/assets/images/acesso-profis-figma.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
              <Text style={{ ...ACESSO_RAPIDO_LABEL_TYPO, color: ACESSO_RAPIDO_LABEL_PROFIS }}>Profis.</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/forum')}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: pressed ? '#DBEAFE' : '#EFF6FF',
                borderRadius: ACESSO_RAPIDO_TILE_RADIUS,
                paddingVertical: 16,
                alignItems: 'center',
                gap: 6,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              })}>
              <Image source={require('@/assets/images/acesso-forum-figma.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
              <Text style={{ ...ACESSO_RAPIDO_LABEL_TYPO, color: ACESSO_RAPIDO_LABEL_FORUM }}>Fórum</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ForumBottomNav active="inicio" accent="purple" />
      </View>
    </View>
  );
}
