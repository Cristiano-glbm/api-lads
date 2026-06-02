import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav } from '@/components/forum/ForumBottomNav';
import { LadsTopBar } from '@/components/lads/LadsTopBar';
import type { ApiEvent } from '@/services/eventsService';
import * as eventsService from '@/services/eventsService';

// ─── Dados ───────────────────────────────────────────────────────────────────

const COLOR_PALETTE = [
  { listCardBg: '#FAFAFF', listCardBorder: '#E5E4FF', dateBadgeBg: '#9B10FA' },
  { listCardBg: '#EFFBFF', listCardBorder: '#B1D3FF', dateBadgeBg: '#2563EB' },
  { listCardBg: '#F0FDF4', listCardBorder: '#DCFCE7', dateBadgeBg: '#16A34A' },
  { listCardBg: '#FDF2F8', listCardBorder: '#FBCFE8', dateBadgeBg: '#DB2777' },
  { listCardBg: '#F0FDF4', listCardBorder: '#BBF7D0', dateBadgeBg: '#059669' },
  { listCardBg: '#EFF6FF', listCardBorder: '#BFDBFE', dateBadgeBg: '#1D4ED8' },
];

type EventoLocal = {
  id: string;
  emoji: string;
  bgColor: string;
  tag: string;
  title: string;
  year: number;
  month: number;
  day: number;
  dateLabel: string;
  inscritos: number;
  descricao: string;
  listCardBg: string;
  listCardBorder: string;
  dateBadgeBg: string;
  dateBadgeColor: string;
};

function mapApiEvent(e: ApiEvent, idx: number): EventoLocal {
  const d = new Date(e.date);
  const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const dateLabel = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')} • ${e.location ?? 'LADS'}`;
  return {
    id: e.id,
    emoji: e.emoji ?? '📅',
    bgColor: '#EDE9FE',
    tag: 'todos',
    title: e.name,
    year,
    month,
    day,
    dateLabel,
    inscritos: e.subscriberCount ?? 0,
    descricao: e.description ?? '',
    dateBadgeColor: '#FFFFFF',
    ...palette,
  };
}

const EVENTOS_FALLBACK: EventoLocal[] = [
  { id: '1', emoji: '🌙', bgColor: '#EDE9FE', tag: 'todos', title: 'Noite Sem Pijama',   year: 2026, month: 2, day: 15, dateLabel: '15/03 • Noite inteira', inscritos: 234, descricao: 'Uma noite de programação, networking e muita diversão.', listCardBg: '#FAFAFF', listCardBorder: '#E5E4FF', dateBadgeBg: '#9B10FA', dateBadgeColor: '#FFFFFF' },
  { id: '2', emoji: '💻', bgColor: '#F3F4F6', tag: 'web',   title: 'Workshop React',      year: 2026, month: 2, day: 20, dateLabel: '20/03 • 14h – 17h',    inscritos: 45,  descricao: 'Aprenda React na prática com os membros do LADS.', listCardBg: '#EFFBFF', listCardBorder: '#B1D3FF', dateBadgeBg: '#2563EB', dateBadgeColor: '#FFFFFF' },
  { id: '3', emoji: '📚', bgColor: '#DCFCE7', tag: 'todos', title: 'Seminário',           year: 2026, month: 2, day: 28, dateLabel: '28/03 • 19h – 21h',    inscritos: 89,  descricao: 'Palestras e discussões com a comunidade LADS.', listCardBg: '#F0FDF4', listCardBorder: '#DCFCE7', dateBadgeBg: '#16A34A', dateBadgeColor: '#FFFFFF' },
  { id: '4', emoji: '🎨', bgColor: '#FCE7F3', tag: 'design',title: 'UI/UX Design Day',   year: 2026, month: 3, day: 5,  dateLabel: '05/04 • 9h – 13h',     inscritos: 61,  descricao: 'Workshop de design de interfaces e UX.', listCardBg: '#FDF2F8', listCardBorder: '#FBCFE8', dateBadgeBg: '#DB2777', dateBadgeColor: '#FFFFFF' },
  { id: '5', emoji: '🤖', bgColor: '#ECFDF5', tag: 'ia',    title: 'IA na Prática',      year: 2026, month: 3, day: 12, dateLabel: '12/04 • 15h – 18h',    inscritos: 120, descricao: 'Explore inteligência artificial e machine learning.', listCardBg: '#F0FDF4', listCardBorder: '#BBF7D0', dateBadgeBg: '#059669', dateBadgeColor: '#FFFFFF' },
  { id: '6', emoji: '📱', bgColor: '#E0F2FE', tag: 'mobile',title: 'Dev Mobile Day',     year: 2026, month: 3, day: 18, dateLabel: '18/04 • 10h – 16h',    inscritos: 73,  descricao: 'React Native e Expo do básico ao avançado.', listCardBg: '#EFF6FF', listCardBorder: '#BFDBFE', dateBadgeBg: '#1D4ED8', dateBadgeColor: '#FFFFFF' },
];

const FILTERS = [
  { id: 'todos',  label: 'Todos'  },
  { id: 'mesa',   label: 'Mesa'   },
  { id: 'web',    label: 'Web'    },
  { id: 'ia',     label: 'IA'     },
  { id: 'mobile', label: 'Mobile' },
];

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
/** Abreviatura em 3 letras para o selo «MAR 15» (lista Eventos — Figma) */
const MES_ABR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'] as const;
const WEEK_DAYS   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

/** Lista «EVENTOS EM …» — Inspect Figma: padding 16, gap 12, contentor branco */
const EVENTOS_LIST_SHELL = {
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  borderWidth: 1.07,
  borderColor: '#F3F4F6',
  padding: 16,
  gap: 12,
} as const;

/** Cabeçalho «EVENTOS EM …» — Figma: Inter 700, 18px / 24px, #112939, maiúsculas + 📍 */
const EVENTOS_SECTION_TITLE = {
  fontFamily: 'Inter_700Bold',
  fontSize: 18,
  lineHeight: 24,
  fontStyle: 'normal' as const,
  color: '#112939',
  letterSpacing: 0,
  textTransform: 'uppercase' as const,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
};

/** Botão «Detalhes» (lista mensal) — Inspect Figma: #FFF, borda #A9A1AF 1px, raio 10, texto #000 Inter 500 12/16 */
const EVENTOS_LIST_DETALHES = {
  borderColor: '#A9A1AF',
  borderWidth: 1,
  borderRadius: 10,
  minHeight: 24,
  paddingVertical: 5,
  paddingHorizontal: 8,
  backgroundColor: '#FFFFFF',
} as const;

/** Barra de filtros (chips) — Inspect Figma: ativo #5B1CFA, raio 14, padding ~7×8.8 */
const EVENTOS_FILTER_ACTIVE = '#5B1CFA';
const EVENTOS_FILTER_TEXT = '#4A5568';
/** Inactivo: fundo branco + borda roxa suave (Figma) */
const EVENTOS_FILTER_BORDER = '#C4B5FD';
const EVENTOS_FILTER_CHIP_RADIUS = 14;
const EVENTOS_FILTER_CHIP_PAD_V = 7;
const EVENTOS_FILTER_CHIP_PAD_H = 8.8;

/** Contentor da barra de filtros — Inspect Figma: padding 16, gap 7 */
const EVENTOS_FILTER_SCROLL_CONTENT = {
  padding: 16,
  gap: 7,
  alignItems: 'center' as const,
};

/** Mesma coluna que `ServicesScreen` (Figma 448px centrada). */
const PAGE_BG = '#F9FAFB';
const EVENTOS_COLUMN = {
  flex: 1,
  flexDirection: 'column' as const,
  alignItems: 'flex-start' as const,
  width: '100%' as const,
  maxWidth: 448,
  alignSelf: 'center' as const,
  backgroundColor: PAGE_BG,
};

/** Área de scroll principal — espelho de `figmaMainScrollArea` em Serviços. */
const EVENTOS_MAIN_SCROLL = {
  width: '100%' as const,
  maxWidth: 448,
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  minWidth: 0,
  backgroundColor: PAGE_BG,
} as const;

/** Título roxo abaixo da top bar — alinhado a `servicesHeadingTypo` / `servicesSubtitleTypo`. */
const EVENTOS_PURPLE_HEADING = {
  fontFamily: 'Inter_700Bold',
  fontSize: 16,
  lineHeight: 24,
  fontStyle: 'normal' as const,
  color: '#FFF',
  letterSpacing: 0,
  flexShrink: 1,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
};
const EVENTOS_PURPLE_SUBTITLE = {
  fontFamily: 'Inter_400Regular',
  fontSize: 12,
  lineHeight: 16,
  fontStyle: 'normal' as const,
  color: '#C6D2FF',
  letterSpacing: 0,
  flexShrink: 1,
  marginTop: 2,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstWeekDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

/** Linha de categoria / detalhe curto — parte após «•» em `dateLabel` (Figma). */
function eventListCategoryLine(dateLabel: string) {
  const i = dateLabel.indexOf('•');
  if (i === -1) return dateLabel.trim();
  return dateLabel.slice(i + 1).trim();
}

// ─── Calendário ──────────────────────────────────────────────────────────────

interface CalendarProps {
  year: number;
  month: number;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  eventos: EventoLocal[];
}

function Calendar({ year, month, selectedDay, onSelectDay, eventos }: CalendarProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstWeekDay(year, month);

  // mapa dia → emojis de eventos
  const eventMap: Record<number, string[]> = {};
  eventos.forEach((e) => {
    if (e.year === year && e.month === month) {
      if (!eventMap[e.day]) eventMap[e.day] = [];
      eventMap[e.day].push(e.emoji);
    }
  });

  // cells: null = vazio, number = dia
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = chunkArray(cells, 7);

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
      {/* Cabeçalho dos dias da semana */}
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        {WEEK_DAYS.map((d) => (
          <Text key={d} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600', color: '#9CA3AF' }}>{d}</Text>
        ))}
      </View>

      {/* Grade */}
      {weeks.map((week, wi) => (
        <View key={wi} style={{ flexDirection: 'row', marginBottom: 4 }}>
          {week.map((day, di) => {
            if (!day) return <View key={di} style={{ flex: 1 }} />;

            const hasEvent  = !!eventMap[day];
            const isSelected = day === selectedDay;
            const emojis    = eventMap[day] ?? [];

            return (
              <Pressable
                key={di}
                onPress={() => onSelectDay(day)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 2 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected
                      ? '#9B10FA'
                      : hasEvent
                      ? '#EDE9FE'
                      : 'transparent',
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: isSelected || hasEvent ? '700' : '400',
                      color: isSelected ? '#fff' : hasEvent ? '#6D28D9' : '#374151',
                    }}>
                    {day}
                  </Text>
                </View>
                {/* Emoji do evento abaixo do número */}
                <Text style={{ fontSize: 11, marginTop: 1, minHeight: 14 }}>
                  {emojis[0] ?? ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ─── Card de evento ───────────────────────────────────────────────────────────

/** Selo «MAR / dia» — Inspect: 40×40, raio 14, padding ~7×10, fundo sólido, texto branco. */
const EVENTO_DATE_BADGE_SIZE = 40;
const EVENTO_DATE_BADGE_RADIUS = 14;
const EVENTO_DATE_BADGE_PAD_V = 7;
const EVENTO_DATE_BADGE_PAD_H = 10;

const EVENTO_LIST_CARD_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
} as const;

function EventoCard({ evento }: { evento: EventoLocal }) {
  const router = useRouter();
  const mesSelo = MES_ABR[evento.month];
  const categoria = eventListCategoryLine(evento.dateLabel);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        minHeight: 82,
        borderRadius: 14,
        borderWidth: 1.067,
        borderColor: evento.listCardBorder,
        backgroundColor: evento.listCardBg,
        ...EVENTO_LIST_CARD_SHADOW_NATIVE,
      }}>
      <View
        style={{
          width: EVENTO_DATE_BADGE_SIZE,
          height: EVENTO_DATE_BADGE_SIZE,
          borderRadius: EVENTO_DATE_BADGE_RADIUS,
          backgroundColor: evento.dateBadgeBg,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: EVENTO_DATE_BADGE_PAD_V,
          paddingHorizontal: EVENTO_DATE_BADGE_PAD_H,
        }}>
        <Text
          style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 10,
            lineHeight: 10,
            color: evento.dateBadgeColor,
            letterSpacing: 0.4,
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          }}>
          {mesSelo}
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 16,
            lineHeight: 16,
            color: evento.dateBadgeColor,
            marginTop: 0,
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          }}>
          {evento.day}
        </Text>
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        {/* Mesmo emoji que no calendário (dias com evento) — Figma */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <Text style={{ fontSize: 18, lineHeight: 20 }}>{evento.emoji}</Text>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              minWidth: 0,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 14,
              lineHeight: 20,
              color: '#1E293B',
              ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
            }}>
            {evento.title}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 12,
            lineHeight: 16,
            color: '#99A1AF',
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          }}>
          {categoria}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Image
            source={require('@/assets/images/inscritos-grupo-figma.png')}
            style={{ width: 14, height: 14 }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              lineHeight: 16,
              color: '#99A1AF',
              ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
            }}>
            {evento.inscritos} inscritos
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push({ pathname: '/evento-detalhe', params: { id: String(evento.id) } })}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        style={({ pressed }) => ({
          alignSelf: 'center',
          justifyContent: 'center',
          ...EVENTOS_LIST_DETALHES,
          opacity: pressed ? 0.92 : 1,
          backgroundColor: pressed ? 'rgba(0,0,0,0.03)' : EVENTOS_LIST_DETALHES.backgroundColor,
        })}>
        <Text
          style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 12,
            lineHeight: 16,
            color: '#000000',
            textAlign: 'center' as const,
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          }}>
          Detalhes
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function EventosRoute() {
  const insets = useSafeAreaInsets();
  const [eventos, setEventos] = useState<EventoLocal[]>(EVENTOS_FALLBACK);

  useEffect(() => {
    eventsService.listEvents()
      .then((list) => {
        if (list.length > 0) setEventos(list.map(mapApiEvent));
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const [viewYear,  setViewYear]  = useState(2026);
  const [viewMonth, setViewMonth] = useState(2);
  const [selectedDay, setSelectedDay] = useState<number | null>(15);
  const [activeFilter, setActiveFilter] = useState('todos');

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  }

  // Filtra eventos: por filtro de categoria E, se dia selecionado, por dia
  const filteredEventos = eventos.filter((e) => {
    const tagOk = activeFilter === 'todos' || activeFilter === 'mesa' || e.tag === activeFilter;
    if (!tagOk) return false;
    if (selectedDay !== null) return e.year === viewYear && e.month === viewMonth && e.day === selectedDay;
    return e.year === viewYear && e.month === viewMonth;
  });

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <View style={[EVENTOS_COLUMN, { flex: 1, minHeight: 0 }]}>
        {/* ── Bloco roxo + `LadsTopBar` — mesmo padrão que `ServicesScreen` ── */}
        <View
          style={{
            width: '100%',
            paddingTop: insets.top,
            backgroundColor: '#432DD7',
            position: 'relative' as const,
            zIndex: 10,
            overflow: 'visible' as const,
          }}>
          <LadsTopBar logoTint="#432DD7" variant="servicos-figma" />
          <View
            style={{
              width: '100%',
              paddingTop: 16,
              paddingRight: 16,
              paddingBottom: 16,
              paddingLeft: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#432DD7',
            }}>
            <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
              <Text style={EVENTOS_PURPLE_HEADING}>📅 Calendário de Eventos</Text>
              <Text style={EVENTOS_PURPLE_SUBTITLE}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Pressable
                onPress={prevMonth}
                hitSlop={8}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: pressed ? '#3730A3' : 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}>
                <FontAwesome name="chevron-left" size={16} color="#fff" />
              </Pressable>
              <Pressable
                onPress={nextMonth}
                hitSlop={8}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: pressed ? '#3730A3' : 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}>
                <FontAwesome name="chevron-right" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView
          style={[EVENTOS_MAIN_SCROLL, { flex: 1, minHeight: 0 }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 14, paddingBottom: 24 }}
        >
        {/* ── Calendário ── */}
        <Calendar
          year={viewYear}
          month={viewMonth}
          selectedDay={selectedDay}
          onSelectDay={(d) => setSelectedDay((prev) => (prev === d ? null : d))}
          eventos={eventos}
        />

        {/* ── Filtros (contentor Figma: padding 16, gap 7) ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={EVENTOS_FILTER_SCROLL_CONTENT}
        >
          {FILTERS.map((f) => {
            const isActive = f.id === activeFilter;
            return (
              <Pressable
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                style={{
                  paddingHorizontal: EVENTOS_FILTER_CHIP_PAD_H,
                  paddingVertical: EVENTOS_FILTER_CHIP_PAD_V,
                  borderRadius: EVENTOS_FILTER_CHIP_RADIUS,
                  backgroundColor: isActive ? EVENTOS_FILTER_ACTIVE : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: isActive ? EVENTOS_FILTER_ACTIVE : EVENTOS_FILTER_BORDER,
                }}>
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 13,
                    lineHeight: 18,
                    color: isActive ? '#FFFFFF' : EVENTOS_FILTER_TEXT,
                    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
                  }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Lista «EVENTOS EM …» (shell Figma: padding 16, gap 12) ── */}
        <View style={{ paddingHorizontal: 16 }}>
          {filteredEventos.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Text style={{ fontSize: 32 }}>📭</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 8 }}>
                Nenhum evento encontrado
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
                Tente outro filtro ou navegue para outro mês.
              </Text>
            </View>
          ) : (
            <View style={EVENTOS_LIST_SHELL}>
              <Text style={EVENTOS_SECTION_TITLE}>
                📍 EVENTOS EM {MONTH_NAMES[viewMonth].toLocaleUpperCase('pt-BR')}
              </Text>
              {filteredEventos.map((e) => (
                <EventoCard key={e.id} evento={e} />
              ))}
            </View>
          )}
        </View>
        </ScrollView>

        <View style={{ width: '100%' }}>
          <ForumBottomNav active="eventos" accent="purple" />
        </View>
      </View>
    </View>
  );
}
