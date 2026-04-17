import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav } from '@/components/forum/ForumBottomNav';
import { LadsTopBar } from '@/components/lads/LadsTopBar';

// ─── Dados ───────────────────────────────────────────────────────────────────

const EVENTOS = [
  { id: 1, emoji: '🌙', bgColor: '#EDE9FE', tag: 'todos', title: 'Noite Sem Pijama',   year: 2026, month: 2, day: 15, dateLabel: '15/03 • Noite inteira', inscritos: 234, descricao: 'Uma noite de programação, networking e muita diversão.' },
  { id: 2, emoji: '💻', bgColor: '#F3F4F6', tag: 'web',   title: 'Workshop React',      year: 2026, month: 2, day: 20, dateLabel: '20/03 • 14h – 17h',    inscritos: 45,  descricao: 'Aprenda React na prática com os membros do LADS.' },
  { id: 3, emoji: '🏆', bgColor: '#FEF9C3', tag: 'todos', title: 'Hackathon Sprint',    year: 2026, month: 2, day: 28, dateLabel: '28/03 • 19h – 21h',    inscritos: 89,  descricao: 'Competição de programação com prêmios incríveis.' },
  { id: 4, emoji: '🎨', bgColor: '#FCE7F3', tag: 'design',title: 'UI/UX Design Day',   year: 2026, month: 3, day: 5,  dateLabel: '05/04 • 9h – 13h',     inscritos: 61,  descricao: 'Workshop de design de interfaces e UX.' },
  { id: 5, emoji: '🤖', bgColor: '#ECFDF5', tag: 'ia',    title: 'IA na Prática',      year: 2026, month: 3, day: 12, dateLabel: '12/04 • 15h – 18h',    inscritos: 120, descricao: 'Explore inteligência artificial e machine learning.' },
  { id: 6, emoji: '📱', bgColor: '#E0F2FE', tag: 'mobile',title: 'Dev Mobile Day',     year: 2026, month: 3, day: 18, dateLabel: '18/04 • 10h – 16h',    inscritos: 73,  descricao: 'React Native e Expo do básico ao avançado.' },
];

const FILTERS = [
  { id: 'todos',  label: 'Todos'  },
  { id: 'meus',   label: 'Meus'   },
  { id: 'web',    label: 'Web'    },
  { id: 'ia',     label: 'IA'     },
  { id: 'mobile', label: 'Mobile' },
];

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const WEEK_DAYS   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

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

// ─── Calendário ──────────────────────────────────────────────────────────────

interface CalendarProps {
  year: number;
  month: number;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

function Calendar({ year, month, selectedDay, onSelectDay }: CalendarProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstWeekDay(year, month);

  // mapa dia → emojis de eventos
  const eventMap: Record<number, string[]> = {};
  EVENTOS.forEach((e) => {
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
                      ? '#4F46E5'
                      : hasEvent
                      ? '#EEF2FF'
                      : 'transparent',
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: isSelected || hasEvent ? '700' : '400',
                      color: isSelected ? '#fff' : hasEvent ? '#4F46E5' : '#374151',
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

function EventoCard({ evento }: { evento: (typeof EVENTOS)[0] }) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
      <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: evento.bgColor, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Text style={{ fontSize: 24 }}>{evento.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{evento.title}</Text>
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{evento.dateLabel}</Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>👥 {evento.inscritos} inscritos</Text>
        <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 4, lineHeight: 16 }}>{evento.descricao}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <Pressable android_ripple={{ color: 'rgba(255,255,255,0.25)' }} style={{ flex: 1, backgroundColor: '#4F46E5', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Inscrever</Text>
          </Pressable>
          <Pressable onPress={() => router.push({ pathname: '/evento-detalhe', params: { id: String(evento.id) } })} android_ripple={{ color: 'rgba(255,255,255,0.2)' }} style={{ flex: 1, backgroundColor: '#6B7280', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Detalhes</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function EventosRoute() {
  const insets = useSafeAreaInsets();

  // Começa em Março 2026 (month=2) para bater com os dados do mock
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
  const filteredEventos = EVENTOS.filter((e) => {
    const tagOk = activeFilter === 'todos' || activeFilter === 'meus' || e.tag === activeFilter;
    if (!tagOk) return false;
    if (selectedDay !== null) return e.year === viewYear && e.month === viewMonth && e.day === selectedDay;
    return e.year === viewYear && e.month === viewMonth;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* ── Header roxo ── */}
      <View style={{ paddingTop: insets.top, backgroundColor: '#432DD7' }}>
        <LadsTopBar logoTint="#432DD7" variant="servicos-figma" />
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>📅 Calendário de Eventos</Text>
            <Text style={{ color: '#C6D2FF', fontSize: 13, marginTop: 2 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
          </View>
          {/* Navegação de mês */}
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Pressable onPress={prevMonth} style={({ pressed }) => ({ width: 32, height: 32, borderRadius: 8, backgroundColor: pressed ? '#3730A3' : 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' })}>
              <FontAwesome name="chevron-left" size={13} color="#fff" />
            </Pressable>
            <Pressable onPress={nextMonth} style={({ pressed }) => ({ width: 32, height: 32, borderRadius: 8, backgroundColor: pressed ? '#3730A3' : 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' })}>
              <FontAwesome name="chevron-right" size={13} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 14, paddingBottom: 24 }}>
        {/* ── Calendário ── */}
        <Calendar
          year={viewYear}
          month={viewMonth}
          selectedDay={selectedDay}
          onSelectDay={(d) => setSelectedDay((prev) => (prev === d ? null : d))}
        />

        {/* ── Filtros ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 12, gap: 8 }}>
          {FILTERS.map((f) => {
            const isActive = f.id === activeFilter;
            return (
              <Pressable
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isActive ? '#4F46E5' : '#fff',
                  borderWidth: 1,
                  borderColor: isActive ? '#4F46E5' : '#E5E7EB',
                }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: isActive ? '#fff' : '#374151' }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Lista de eventos ── */}
        <View style={{ paddingHorizontal: 14 }}>
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
            filteredEventos.map((e) => <EventoCard key={e.id} evento={e} />)
          )}
        </View>
      </ScrollView>

      <ForumBottomNav active="eventos" accent="purple" />
    </View>
  );
}
