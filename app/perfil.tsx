import { Fragment, useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForumBottomNav } from '@/components/forum/ForumBottomNav';
import { LadsTopBar } from '@/components/lads/LadsTopBar';
import { useAuth } from '@/context/AuthContext';
import * as authService from '@/services/authService';
import * as eventsService from '@/services/eventsService';
import * as forumService from '@/services/forumService';

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

// ─── Tipos locais de exibição ─────────────────────────────────────────────────

type ProfilePostItem = { id: string; title: string; tag?: string; likes: number; comments: number; date: string };
type ProfileEventItem = { id: string; emoji: string; name: string; date: string; location?: string };

function fmtDate(raw: string): string {
  if (!raw) return '';
  if (/^\d{2}\/\d{2}\/\d{4}/.test(raw)) return raw.split(/\s+/)[0];
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const FALLBACK_EVENTS: ProfileEventItem[] = [
  { id: 'fe1', emoji: '🌙', name: 'Noite Sem Pijama', date: '15/03/2026', location: 'LADS Lab' },
  { id: 'fe2', emoji: '💡', name: 'Hackathon LADS 2026', date: '22/04/2026', location: 'Auditório Central' },
];

const FALLBACK_POSTS: ProfilePostItem[] = [
  { id: 'fp1', title: 'Qual linguagem usar na madrugada?', tag: 'Técnico', likes: 18, comments: 8, date: '17/08/2026' },
  { id: 'fp2', title: 'Alguém para formar equipe?', tag: 'Networking', likes: 11, comments: 5, date: '15/03/2026' },
];

// ─── Dados mock ──────────────────────────────────────────────────────────────

const STATS: Array<{ ion: keyof typeof Ionicons.glyphMap; value: number; label: string }> = [
  { ion: 'calendar-outline', value: 5, label: 'Eventos\ninscritos' },
  { ion: 'chatbubble-ellipses-outline', value: 8, label: 'Tópicos\ncriados' },
  { ion: 'arrow-undo-outline', value: 24, label: 'Respostas' },
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
  const { user, logout, updateUser } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [myEvents, setMyEvents] = useState<ProfileEventItem[]>(FALLBACK_EVENTS);
  const [myPosts, setMyPosts] = useState<ProfilePostItem[]>(FALLBACK_POSTS);

  useEffect(() => {
    eventsService.listMyEvents()
      .then((list) => {
        if (list.length > 0) {
          setMyEvents(list.slice(0, 3).map((e) => ({
            id: e.id,
            emoji: e.emoji ?? '📅',
            name: e.name,
            date: fmtDate(e.date),
            location: e.location,
          })));
        }
      })
      .catch(() => {});

    forumService.listPosts()
      .then((posts) => {
        const mine = posts.filter((p) => p.author.id === user?.id);
        const source = mine.length > 0 ? mine : posts;
        setMyPosts(source.slice(0, 3).map((p) => ({
          id: p.id,
          title: p.title,
          tag: p.tag,
          likes: p._count?.likes ?? p.likes,
          comments: p._count?.comments ?? 0,
          date: fmtDate(p.createdAt),
        })));
      })
      .catch(() => {});
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      authService.getMe()
        .then((fresh) => { if (fresh) updateUser(fresh); })
        .catch(() => {});
    }, [])
  );
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
            {user?.name?.toUpperCase() ?? 'UTILIZADOR'}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              color: 'rgba(255,255,255,0.72)',
              marginTop: 4,
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            }}>
            ✉ {user?.email ?? ''}
          </Text>
          {user?.bio ? (
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: 'rgba(255,255,255,0.92)',
                marginTop: 6,
                textAlign: 'center',
                paddingHorizontal: 24,
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
              }}>
              {user.bio}
            </Text>
          ) : null}
          {user?.course ? (
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 12,
                color: 'rgba(255,255,255,0.72)',
                marginTop: 4,
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
              }}>
              🎓 {user.course}
            </Text>
          ) : null}
          {user?.institution ? (
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 12,
                color: 'rgba(255,255,255,0.72)',
                marginTop: 2,
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
              }}>
              📍 {user.institution}
            </Text>
          ) : null}
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

          {/* Seguidores */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="people-outline" size={16} color={STAT_ICON_TINT} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#374151' }}>Seguidores</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 28, color: STAT_NUMBER_COLOR }}>128</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: STAT_LABEL_COLOR, alignSelf: 'flex-end', marginBottom: 4 }}>pessoas te seguem</Text>
          </View>
        </SectionCard>

        {/* ── Publicações recentes ── */}
        <SectionCard>
          <SectionTitle emoji="💬" label="PUBLICAÇÕES RECENTES" />
          {myPosts.map((post, idx) => (
            <View key={post.id}>
              {idx > 0 && <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 }} />}
              <View style={{ gap: 6 }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 13,
                    lineHeight: 18,
                    color: '#1E2939',
                    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                  }}>
                  {post.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {post.tag ? (
                    <View style={{ backgroundColor: '#EEF2FF', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: '#4338CA' }}>{post.tag}</Text>
                    </View>
                  ) : null}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="heart-outline" size={13} color="#9CA3AF" />
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF' }}>{post.likes}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="chatbubble-outline" size={12} color="#9CA3AF" />
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF' }}>{post.comments}</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF' }}>{post.date}</Text>
                </View>
              </View>
            </View>
          ))}
          <Pressable
            onPress={() => router.push('/forum')}
            style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: STAT_ICON_TINT }}>
              Ver todas no Fórum →
            </Text>
          </Pressable>
        </SectionCard>

        {/* ── Eventos inscritos ── */}
        <SectionCard>
          <SectionTitle emoji="📅" label="EVENTOS INSCRITOS" />
          {myEvents.map((ev, idx) => (
            <View key={ev.id}>
              {idx > 0 && <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 }} />}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: STAT_CARD_BG,
                    borderWidth: 1,
                    borderColor: STAT_CARD_BORDER,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 22 }}>{ev.emoji}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 13,
                      lineHeight: 18,
                      color: '#1E2939',
                      ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                    }}>
                    {ev.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF' }}>{ev.date}</Text>
                    {ev.location ? (
                      <>
                        <Text style={{ color: '#D1D5DB', fontSize: 11 }}>·</Text>
                        <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                        <Text numberOfLines={1} style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF', flex: 1 }}>{ev.location}</Text>
                      </>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          ))}
          <Pressable
            onPress={() => router.push('/eventos')}
            style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: STAT_ICON_TINT }}>
              Ver todos os Eventos →
            </Text>
          </Pressable>
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
                else if (item.title === 'Editar Perfil') { setSettingsOpen(false); setTimeout(() => router.push('/editar-perfil'), 200); }
                else if (item.title === 'Sair') { setSettingsOpen(false); setTimeout(() => { logout(); }, 200); }
                else { setSettingsOpen(false); }
              }
              return (
                <Fragment key={item.title}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleSettingPress}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      minHeight: SETTINGS_ROW_MIN_H,
                      paddingVertical: 12,
                      paddingHorizontal: 4,
                      width: '100%',
                      backgroundColor: pressed ? '#F3F4F6' : 'transparent',
                      borderRadius: 10,
                    })}>
                    <View style={{ width: SETTINGS_ICON_SLOT, height: SETTINGS_ICON_SLOT, borderRadius: SETTINGS_ICON_SLOT / 2, backgroundColor: item.iconBg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Ionicons name={item.ion} size={20} color={item.iconColor} />
                    </View>
                    <View style={{ flex: 1, marginLeft: SETTINGS_ICON_TEXT_GAP }}>
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
