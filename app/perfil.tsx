import { FontAwesome } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav } from '@/components/forum/ForumBottomNav';
import { LadsTopBar } from '@/components/lads/LadsTopBar';

// ─── Constantes Figma ────────────────────────────────────────────────────────

const BAR_BG       = '#432DD7';
const PAGE_MAX_W   = 448;
const CARD_RADIUS  = 14;
const CARD_BORDER  = '#F3F4F6';
const SECTION_LABEL: Record<string, string> = {};

const cardShadowWeb    = { boxShadow: '0 1px 3px 0 rgba(0,0,0,.10), 0 1px 2px -1px rgba(0,0,0,.10)' } as const;
const cardShadowNative = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 } as const;
const cardShadow       = Platform.OS === 'web' ? cardShadowWeb : cardShadowNative;

// ─── Dados mock ──────────────────────────────────────────────────────────────

const STATS = [
  { icon: 'calendar' as const, iconBg: '#FEE2E2', iconColor: '#EF4444', value: 5,  label: 'Eventos\nInscritos' },
  { icon: 'comment'  as const, iconBg: '#EEF2FF', iconColor: '#4F46E5', value: 8,  label: 'Tópicos\ncriados'   },
  { icon: 'exchange' as const, iconBg: '#EDE9FE', iconColor: '#7C3AED', value: 24, label: 'Respostas'           },
];

const MEUS_EVENTOS = [
  { id: 1, emoji: '🌙', bgColor: '#EDE9FE', title: 'Noite Sem Pijama',  date: '15/03/2026', status: 'confirmado' as const },
  { id: 2, emoji: '💻', bgColor: '#F3F4F6', title: 'Workshop React',    date: '20/03/2026', status: 'confirmado' as const },
  { id: 3, emoji: '🏆', bgColor: '#FEF9C3', title: 'Hackathon Sprint',  date: '10/04/2026', status: 'fila'       as const },
];

const SETTINGS = [
  { icon: 'pencil'   as const, iconBg: '#ECECF4', iconColor: '#6366F1', title: 'Editar Perfil',  subtitle: 'Atualizar informações pessoais', red: false },
  { icon: 'lock'     as const, iconBg: '#ECECF4', iconColor: '#6366F1', title: 'Privacidade',    subtitle: 'Controle de visibilidade',        red: false },
  { icon: 'bell'     as const, iconBg: '#ECECF4', iconColor: '#6366F1', title: 'Notificações',   subtitle: 'Preferências de alertas',          red: false },
  { icon: 'sign-out' as const, iconBg: '#FEE8E8', iconColor: '#EF4444', title: 'Sair',           subtitle: 'Encerrar sessão',                 red: true  },
];

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: CARD_RADIUS,
        borderWidth: 1.067,
        borderColor: CARD_BORDER,
        padding: 16,
        marginBottom: 12,
        ...cardShadow,
      }}>
      {children}
    </View>
  );
}

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
      <Text style={{ fontSize: 14 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: 'Inter_700Bold',
          fontSize: 14,
          lineHeight: 20,
          color: '#1E2939',
          textTransform: 'uppercase',
          letterSpacing: 0,
          ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
        }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Tela ────────────────────────────────────────────────────────────────────

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* ── Header ── */}
      <View
        style={{
          backgroundColor: BAR_BG,
          paddingTop: insets.top,
          width: '100%',
          maxWidth: PAGE_MAX_W,
          alignSelf: 'center',
        }}>
        <LadsTopBar variant="servicos-figma" />

        {/* Seção do usuário */}
        <View style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 28 }}>
          {/* Avatar */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#818CF8',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#fff',
            }}>
            <FontAwesome name="user" size={38} color="#fff" />
          </View>

          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#fff', marginTop: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            JOÃO SILVA
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#C7D2FE', marginTop: 3 }}>
            🎓 Estudante de Engenharia
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#A5B4FC', marginTop: 4 }}>
            📍 Faculdade X
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#A5B4FC', marginTop: 2 }}>
            ✉ joao@email.com
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#A5B4FC', marginTop: 2 }}>
            📞 (+1) 99999-8888
          </Text>
        </View>
      </View>

      {/* ── Conteúdo ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: '100%',
          maxWidth: PAGE_MAX_W,
          alignSelf: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        style={{ width: '100%' }}>

        {/* ── Atividade ── */}
        <SectionCard>
          <SectionTitle emoji="📊" label="ATIVIDADE" />

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {STATS.map((s) => (
              <View
                key={s.label}
                style={{
                  flex: 1,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#F3F4F6',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                  gap: 4,
                }}>
                <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: s.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesome name={s.icon} size={16} color={s.iconColor} />
                </View>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#111827' }}>{s.value}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#6B7280', textAlign: 'center', lineHeight: 13 }}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#374151' }}>⭐ Rating da Comunidade</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
            {[1, 2, 3, 4].map((i) => (
              <FontAwesome key={i} name="star" size={18} color="#FACC15" />
            ))}
            <FontAwesome name="star-half-o" size={18} color="#FACC15" />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9CA3AF', marginLeft: 4 }}>(42 votos)</Text>
          </View>
        </SectionCard>

        {/* ── Meus Eventos ── */}
        <SectionCard>
          <SectionTitle emoji="🗓️" label="MEUS EVENTOS" />

          {MEUS_EVENTOS.map((ev, idx) => (
            <View
              key={ev.id}
              style={{
                borderTopWidth: idx === 0 ? 0 : 1,
                borderTopColor: '#F3F4F6',
                paddingTop: idx === 0 ? 0 : 12,
                marginTop: idx === 0 ? 0 : 12,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                {/* Emoji */}
                <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: ev.bgColor, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>{ev.emoji}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: '#111827' }}>{ev.title}</Text>
                    {/* Badge */}
                    <View style={{
                      borderRadius: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      backgroundColor: ev.status === 'confirmado' ? '#DCFCE7' : '#FEF3C7',
                    }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: ev.status === 'confirmado' ? '#16A34A' : '#D97706' }}>
                        {ev.status === 'confirmado' ? '✅ Confirmado' : '⏳ Fila espera'}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#6B7280', marginTop: 2 }}>📅 {ev.date}</Text>
                </View>
              </View>

              {/* Botões */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {ev.status === 'confirmado' ? (
                  <>
                    <Pressable style={({ pressed }) => ({ flex: 1, borderRadius: 8, borderWidth: 1, borderColor: '#FDA4AF', backgroundColor: pressed ? '#FFF1F2' : '#fff', paddingVertical: 7, alignItems: 'center' })}>
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#F43F5E' }}>Cancelar</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => ({ flex: 1, borderRadius: 8, backgroundColor: pressed ? '#4338CA' : '#4F46E5', paddingVertical: 7, alignItems: 'center' })}>
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#fff' }}>Detalhes</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable style={({ pressed }) => ({ flex: 1, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: pressed ? '#F9FAFB' : '#fff', paddingVertical: 7, alignItems: 'center' })}>
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#6B7280' }}>Aguardando</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => ({ flex: 1, borderRadius: 8, borderWidth: 1, borderColor: '#FDA4AF', backgroundColor: pressed ? '#FFF1F2' : '#fff', paddingVertical: 7, alignItems: 'center' })}>
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#F43F5E' }}>Cancelar</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          ))}
        </SectionCard>

        {/* ── Configurações ── */}
        <SectionCard>
          {SETTINGS.map((item, idx) => (
            <View key={item.title}>
              {idx > 0 && <View style={{ height: 1, backgroundColor: '#F0F0F5', marginHorizontal: -16 }} />}
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  backgroundColor: pressed ? '#F9FAFB' : 'transparent',
                  borderRadius: 8,
                })}>
                {/* Ícone circular */}
                <View style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: item.iconBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <FontAwesome name={item.icon} size={18} color={item.iconColor} />
                </View>

                {/* Textos */}
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 15,
                    lineHeight: 22,
                    color: item.red ? '#EF4444' : '#111827',
                  }}>
                    {item.title}
                  </Text>
                  <Text style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    lineHeight: 18,
                    color: '#9CA3AF',
                    marginTop: 1,
                  }}>
                    {item.subtitle}
                  </Text>
                </View>

                {/* Seta */}
                <FontAwesome name="chevron-right" size={12} color="#D1D5DB" />
              </Pressable>
            </View>
          ))}
        </SectionCard>
      </ScrollView>

      <ForumBottomNav active="perfil" accent="purple" />
    </View>
  );
}
