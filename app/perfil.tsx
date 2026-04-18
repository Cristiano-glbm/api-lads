import { Fragment, useState } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, type ImageSourcePropType, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav } from '@/components/forum/ForumBottomNav';
import { LadsTopBar } from '@/components/lads/LadsTopBar';
import { crossAlert } from '@/utils/crossAlert';

// ─── Constantes Figma ────────────────────────────────────────────────────────

/** Figma header: gradiente linear topo → base */
const HEADER_GRADIENT_TOP = '#432DD7';
const HEADER_GRADIENT_BOTTOM = '#8200DB';
/** Top bar: 56px (Inspect Figma); fundo sólido, separado do bloco gradiente */
const HEADER_TOP_BAR_HEIGHT = 56;
/** Área do perfil com gradiente (Inspect: ~260px de altura do container) */
const HEADER_PROFILE_GRADIENT_MIN_H = 260;
/** Linha entre top bar e gradiente — roxo mais escuro (Figma), não branco sobre roxo */
const HEADER_TOP_BAR_DIVIDER = 'rgba(0, 0, 0, 0.18)';
const PAGE_MAX_W   = 448;
/** Separadores entre linhas de configurações (Figma) */
const SETTINGS_ROW_SEPARATOR = '#F9FAFB';
const SETTINGS_ROW_MIN_H = 65;
const SETTINGS_ICON_SLOT = 40;
const SETTINGS_ICON_TEXT_GAP = 12;
/** Linha do separador alinhada ao texto (após ícone + gap) */
const SETTINGS_LINE_INSET = SETTINGS_ICON_SLOT + SETTINGS_ICON_TEXT_GAP;
const CARD_RADIUS  = 14;
const CARD_BORDER  = '#F3F4F6';
const EVENT_CARD_BORDER = 1.0667 as const;
/** Cartão Meus Eventos — espaçamento equilibrado entre blocos */
const EVENT_CARD_PAD = 14;
const EVENT_LEAD_SIZE = 48;
const EVENT_ROW_GAP = 12;
const EVENT_BTN_MIN_H = 40;
const EVENT_BTN_RADIUS = 10;
const SECTION_LABEL: Record<string, string> = {};

/** Cartões ATIVIDADE (Figma: fundo lavanda claro, cantos ~12, números/legendas índigo) */
const STAT_CARD_BG = '#F5F7FF';
const STAT_CARD_BORDER = '#E8ECFF';
const STAT_CARD_RADIUS = 12;
const STAT_NUMBER_COLOR = '#3730A3';
const STAT_LABEL_COLOR = '#6366F1';
const STAT_ICON_TINT = '#4338CA';

const cardShadowWeb    = { boxShadow: '0 1px 3px 0 rgba(0,0,0,.10), 0 1px 2px -1px rgba(0,0,0,.10)' } as const;
const cardShadowNative = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 } as const;
const cardShadow       = Platform.OS === 'web' ? cardShadowWeb : cardShadowNative;

// ─── Dados mock ──────────────────────────────────────────────────────────────

const STATS: Array<{ ion: keyof typeof Ionicons.glyphMap; value: number; label: string }> = [
  { ion: 'calendar-outline', value: 5, label: 'Eventos\ninscritos' },
  { ion: 'chatbubble-ellipses-outline', value: 8, label: 'Tópicos\ncriados' },
  { ion: 'arrow-undo-outline', value: 24, label: 'Respostas' },
];

const MEUS_EVENTOS: Array<{
  id: number;
  title: string;
  date: string;
  status: 'confirmado' | 'fila';
  bgColor: string;
  /** Arte Figma / assets locais (não emoji) */
  leadImage?: ImageSourcePropType;
  leadIon?: keyof typeof Ionicons.glyphMap;
  leadIonColor?: string;
}> = [
  {
    id: 1,
    bgColor: '#EDE9FE',
    title: 'Noite Sem Pijama',
    date: '15/03/2026',
    status: 'confirmado',
    leadImage: require('@/assets/images/forum-moon.png'),
  },
  {
    id: 2,
    bgColor: '#F3F4F6',
    title: 'Workshop React',
    date: '20/03/2026',
    status: 'confirmado',
    leadImage: require('@/assets/images/category-laptop.png'),
  },
  {
    id: 3,
    bgColor: '#DCFCE7',
    title: 'Seminário',
    date: '28/03/2026',
    status: 'confirmado',
    leadIon: 'school-outline',
    leadIonColor: '#15803D',
  },
  {
    id: 10,
    bgColor: '#FFFBE8',
    title: 'Hackathon Sprint',
    date: '28/03/2026',
    status: 'fila',
    leadIon: 'trophy-outline',
    leadIonColor: '#CA8A04',
  },
];

/** Figma: quadrado claro + Ionicons, gap 12 com texto; Sair com fundo vermelho claro */
const SETTINGS: Array<{
  ion: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  red: boolean;
  iconBg: string;
  iconColor: string;
}> = [
  { ion: 'person-outline', title: 'Editar Perfil', subtitle: 'Atualizar informações pessoais', red: false, iconBg: '#ECECF4', iconColor: '#6366F1' },
  { ion: 'lock-closed-outline', title: 'Privacidade', subtitle: 'Controle de visibilidade', red: false, iconBg: '#ECECF4', iconColor: '#6366F1' },
  { ion: 'notifications-outline', title: 'Notificações', subtitle: 'Preferências de alertas', red: false, iconBg: '#ECECF4', iconColor: '#6366F1' },
  { ion: 'log-out-outline', title: 'Sair', subtitle: 'Encerrar sessão', red: true, iconBg: '#FEE8E8', iconColor: '#EF4444' },
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

function EventStatusBadge({ status }: { status: 'confirmado' | 'fila' }) {
  const isOk = status === 'confirmado';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 3,
          backgroundColor: isOk ? '#00A63E' : '#D97706',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={isOk ? 'checkmark' : 'hourglass-outline'} size={isOk ? 11 : 10} color="#fff" />
      </View>
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 12,
          lineHeight: 16,
          letterSpacing: 0,
          color: '#0A0A0A',
          ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
        }}>
        {isOk ? 'Confirmado' : 'Fila espera'}
      </Text>
    </View>
  );
}

function SectionTitle({ emoji, label, marginBottom = 14 }: { emoji: string; label: string; marginBottom?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom }}>
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
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [eventos, setEventos] = useState(MEUS_EVENTOS.map((e) => ({ ...e })));

  function cancelarEvento(id: number) {
    crossAlert('Cancelar inscrição', 'Tem certeza que deseja cancelar a inscrição neste evento?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar inscrição',
        style: 'destructive',
        onPress: () => setEventos((prev) => prev.filter((e) => e.id !== id)),
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* ── Header: 1) Top bar 56px + divisor  2) Container gradiente perfil (Figma) ── */}
      <View style={{ width: '100%', maxWidth: PAGE_MAX_W, alignSelf: 'center' }}>
        <View
          style={{
            width: '100%',
            paddingTop: insets.top,
            backgroundColor: HEADER_GRADIENT_TOP,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: HEADER_TOP_BAR_DIVIDER,
          }}>
          <View style={{ width: '100%', minHeight: HEADER_TOP_BAR_HEIGHT, justifyContent: 'center' }}>
            <LadsTopBar variant="meu-perfil-figma" onPressSettings={() => setSettingsOpen(true)} />
          </View>
        </View>

        <LinearGradient
          colors={[HEADER_GRADIENT_TOP, HEADER_GRADIENT_BOTTOM]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            width: '100%',
            minHeight: HEADER_PROFILE_GRADIENT_MIN_H,
            paddingBottom: 24,
          }}>
        {/* Seção do utilizador — espaço após a divisão (Figma) */}
        <View style={{ alignItems: 'center', paddingTop: 16 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#fff',
            }}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>

          <Text
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: 18,
              color: '#fff',
              marginTop: 10,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            }}>
            JOÃO SILVA
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 13,
              color: 'rgba(255,255,255,0.92)',
              marginTop: 3,
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            }}>
            🎓 Estudante de Engenharia
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              color: 'rgba(255,255,255,0.72)',
              marginTop: 4,
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            }}>
            📍 Faculdade X
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              color: 'rgba(255,255,255,0.72)',
              marginTop: 2,
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            }}>
            ✉ joao@email.com
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              color: 'rgba(255,255,255,0.72)',
              marginTop: 2,
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            }}>
            📞 (+1) 99999-8888
          </Text>
        </View>
        </LinearGradient>
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
        style={{ flex: 1, width: '100%' }}>

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
                  minWidth: 0,
                  backgroundColor: STAT_CARD_BG,
                  borderRadius: STAT_CARD_RADIUS,
                  borderWidth: 1,
                  borderColor: STAT_CARD_BORDER,
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 6,
                  gap: 6,
                }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: '#EEF2FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name={s.ion} size={22} color={STAT_ICON_TINT} />
                </View>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: STAT_NUMBER_COLOR }}>{s.value}</Text>
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 10,
                    color: STAT_LABEL_COLOR,
                    textAlign: 'center',
                    lineHeight: 13,
                    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                  }}>
                  {s.label}
                </Text>
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

        {/* ── Meus Eventos (layout: ícone 48, título + estado na mesma linha, ações uniformes) ── */}
        <SectionCard>
          <SectionTitle emoji="🗓️" label="MEUS EVENTOS" marginBottom={12} />

          {eventos.length === 0 && (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingVertical: 12 }}>
              Nenhum evento inscrito.
            </Text>
          )}
          {eventos.map((ev, idx) => (
            <View
              key={ev.id}
              style={{
                width: '100%',
                borderWidth: EVENT_CARD_BORDER,
                borderColor: CARD_BORDER,
                borderRadius: CARD_RADIUS,
                padding: EVENT_CARD_PAD,
                gap: EVENT_ROW_GAP,
                marginBottom: idx < MEUS_EVENTOS.length - 1 ? 12 : 0,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: EVENT_ROW_GAP }}>
                <View
                  style={{
                    width: EVENT_LEAD_SIZE,
                    height: EVENT_LEAD_SIZE,
                    borderRadius: 10,
                    backgroundColor: ev.bgColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                  {ev.leadImage != null ? (
                    <Image source={ev.leadImage} style={{ width: 28, height: 28 }} resizeMode="contain" />
                  ) : ev.leadIon != null ? (
                    <Ionicons name={ev.leadIon} size={24} color={ev.leadIonColor ?? '#111827'} />
                  ) : null}
                </View>

                <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        flex: 1,
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 14,
                        lineHeight: 20,
                        color: '#1E2939',
                        ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                      }}>
                      {ev.title}
                    </Text>
                    <EventStatusBadge status={ev.status} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="calendar-outline" size={14} color="#6A7282" />
                    <Text
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                        lineHeight: 16,
                        letterSpacing: 0,
                        color: '#6A7282',
                        ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                      }}>
                      {ev.date}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar inscrição neste evento"
                  onPress={() => cancelarEvento(ev.id)}
                  style={({ pressed }) => ({
                    flex: 1,
                    minHeight: EVENT_BTN_MIN_H,
                    borderRadius: EVENT_BTN_RADIUS,
                    borderWidth: 1,
                    borderColor: '#FDA4AF',
                    backgroundColor: pressed ? '#FFF1F2' : '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                    marginRight: 10,
                  })}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#E11D48' }}>Cancelar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Ver detalhes do evento"
                  onPress={() => router.push({ pathname: '/evento-detalhe', params: { id: String(ev.id) } })}
                  style={({ pressed }) => ({
                    flex: 1,
                    minHeight: EVENT_BTN_MIN_H,
                    borderRadius: EVENT_BTN_RADIUS,
                    backgroundColor: pressed ? '#3A28C4' : '#432DD7',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                  })}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#fff' }}>Detalhes</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </SectionCard>

        {/* ── Configurações (Figma: ~65px, gap 12, ícone circular; separador alinhado ao texto) ── */}
        <SectionCard>
          {SETTINGS.map((item, idx) => {
            const showChevron = item.ion !== 'log-out-outline';
            return (
              <Fragment key={item.title}>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    minHeight: SETTINGS_ROW_MIN_H,
                    paddingVertical: 12,
                    width: '100%',
                    backgroundColor: pressed ? SETTINGS_ROW_SEPARATOR : 'transparent',
                  })}>
                  <View
                    style={{
                      width: SETTINGS_ICON_SLOT,
                      height: SETTINGS_ICON_SLOT,
                      borderRadius: SETTINGS_ICON_SLOT / 2,
                      backgroundColor: item.iconBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name={item.ion} size={20} color={item.iconColor} />
                  </View>

                  <View style={{ flex: 1, minWidth: 0, marginLeft: SETTINGS_ICON_TEXT_GAP }}>
                    <Text
                      style={{
                        fontFamily: 'Inter_700Bold',
                        fontSize: 15,
                        lineHeight: 22,
                        color: item.red ? '#EF4444' : '#111827',
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                        lineHeight: 16,
                        letterSpacing: 0,
                        color: '#6A7282',
                        marginTop: 1,
                        ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                      }}>
                      {item.subtitle}
                    </Text>
                  </View>

                  {showChevron ? <Ionicons name="chevron-forward" size={18} color="#D1D5DB" /> : null}
                </Pressable>
                {idx < SETTINGS.length - 1 ? (
                  <View style={{ flexDirection: 'row', paddingLeft: SETTINGS_LINE_INSET }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: SETTINGS_ROW_SEPARATOR }} />
                  </View>
                ) : null}
              </Fragment>
            );
          })}
        </SectionCard>
      </ScrollView>

      <ForumBottomNav active="perfil" accent="purple" />

      {/* ── Modal de Configurações ── */}
      <Modal
        visible={settingsOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSettingsOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}
          onPress={() => setSettingsOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 12,
              paddingHorizontal: 16,
              paddingBottom: Math.max(insets.bottom, 24) + 8,
              maxWidth: PAGE_MAX_W,
              alignSelf: 'center',
              width: '100%',
            }}>
            {/* Alça */}
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 22, color: '#111827', marginBottom: 4 }}>
              Configurações
            </Text>
            {SETTINGS.map((item, idx) => {
              const showChevron = item.ion !== 'log-out-outline';
              function handleSettingPress() {
                if (item.title === 'Notificações') { setSettingsOpen(false); setTimeout(() => router.push('/notificacoes'), 200); }
                else if (item.title === 'Sair') { setSettingsOpen(false); setTimeout(() => router.replace('/login'), 200); }
                else { setSettingsOpen(false); }
              }
              return (
                <Fragment key={item.title}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleSettingPress}
                    android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      minHeight: SETTINGS_ROW_MIN_H,
                      paddingVertical: 12,
                      width: '100%',
                      backgroundColor: pressed ? SETTINGS_ROW_SEPARATOR : 'transparent',
                      borderRadius: 10,
                    })}>
                    <View style={{ width: SETTINGS_ICON_SLOT, height: SETTINGS_ICON_SLOT, borderRadius: SETTINGS_ICON_SLOT / 2, backgroundColor: item.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={item.ion} size={20} color={item.iconColor} />
                    </View>
                    <View collapsable={false} style={{ flex: 1, minWidth: 0, marginLeft: SETTINGS_ICON_TEXT_GAP }}>
                      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 22, color: item.red ? '#EF4444' : '#111827', ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}) }}>
                        {item.title}
                      </Text>
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16, color: '#6A7282', marginTop: 1, ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}) }}>
                        {item.subtitle}
                      </Text>
                    </View>
                    {showChevron && <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />}
                  </Pressable>
                  {idx < SETTINGS.length - 1 && (
                    <View style={{ flexDirection: 'row', paddingLeft: SETTINGS_LINE_INSET }}>
                      <View style={{ flex: 1, height: 1, backgroundColor: SETTINGS_ROW_SEPARATOR }} />
                    </View>
                  )}
                </Fragment>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
