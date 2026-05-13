import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PROFESSIONAL_CARLOS } from '@/constants/professionalsMock';
import type { ProfessionalProfile } from '@/types/professional';
import { ForumBottomNav } from '../forum/ForumBottomNav';
import { LadsModal, type LadsModalButton } from '../lads/LadsModal';

/** Frame / barra — Inspect Figma (2.ª e 3.ª refs) */
const BAR_MAX_W = 448;
const BAR_PAD_H = 16;
const BAR_ROW_H = 56;
const BAR_BG = '#432DD7';

/** Inspect (3.ª foto): `box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1)` */
const BAR_SHADOW_WEB = {
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
} as const;
const BAR_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
} as const;

const CARD_RADIUS = 16;
/** Figma: folga visível entre cartões brancos (~16–20px) */
const CARD_GAP = 16;

/** Inspect Figma (foto do avatar): 80×80, borda 3,2px #FFF 40%, sombras duplas */
const AVATAR_SIZE = 80;
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const AVATAR_BORDER = 3.2;
const AVATAR_BORDER_COLOR = 'rgba(255,255,255,0.4)';

const AVATAR_SHADOW_WEB = {
  boxShadow: '0 4px 6px -4px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
} as const;
const AVATAR_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 8,
} as const;

/** Folga entre a barra 56px e o avatar — evita encostar / “subir” visualmente à barra */
const BAR_TO_AVATAR_GAP = 24;
const CONTACT_BTN_R = 10;
const ACTION_BTN_R = 10;

const CARD_SHELL = {
  borderRadius: CARD_RADIUS,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  backgroundColor: '#FFFFFF',
  padding: 16,
} as const;

const CARD_SHADOW_WEB = {
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
} as const;
const CARD_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
} as const;

export interface ProfessionalProfileScreenProps {
  professional?: ProfessionalProfile;
  onBackPress?: () => void;
  onPressSolicitar?: () => void;
  onPressSeguir?: () => void;
  onPressMensagem?: () => void;
}

export function ProfessionalProfileScreen({
  professional = PROFESSIONAL_CARLOS,
  onBackPress,
  onPressSolicitar,
  onPressSeguir,
  onPressMensagem,
}: ProfessionalProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [seguindo, setSeguindo] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; title: string; message: string; buttons: LadsModalButton[] }>({
    visible: false, title: '', message: '', buttons: [],
  });
  function closeModal() { setModal((m) => ({ ...m, visible: false })); }
  function showModal(title: string, message: string, buttons: LadsModalButton[]) {
    setModal({ visible: true, title, message, buttons });
  }

  function abrirLink(url: string) {
    Linking.openURL(url).catch(() =>
      showModal('Ops!', 'Não foi possível abrir o link.', [{ text: 'Fechar', onPress: closeModal }]),
    );
  }

  function onPressSolicitarDefault() {
    showModal(
      '💼 Solicitar Serviço',
      `Deseja enviar uma solicitação de serviço para ${professional.name}?`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: closeModal },
        { text: 'Confirmar', onPress: () => showModal('✅ Solicitação enviada!', 'O profissional receberá sua solicitação em breve.', [{ text: 'OK', onPress: closeModal }]) },
      ],
    );
  }

  function onPressMensagemDefault() {
    showModal(
      '💬 Enviar Mensagem',
      'Em breve você poderá enviar mensagens diretamente pelo LADS. Fique atento às novidades! 🚀',
      [{ text: 'Entendido', onPress: closeModal }],
    );
  }

  const STAR_GOLD = '#FDC700';
  const barShadow = Platform.OS === 'web' ? BAR_SHADOW_WEB : BAR_SHADOW_NATIVE;
  const cardShadow = Platform.OS === 'web' ? CARD_SHADOW_WEB : CARD_SHADOW_NATIVE;
  const avatarShadow = Platform.OS === 'web' ? AVATAR_SHADOW_WEB : AVATAR_SHADOW_NATIVE;
  const cardStyle = [CARD_SHELL, cardShadow];

  return (
    <View className="flex-1 bg-forum-bg">
      <LinearGradient
        colors={['#432DD7', '#8200DB']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          width: '100%',
          maxWidth: BAR_MAX_W,
          alignSelf: 'center',
          alignItems: 'stretch',
          paddingTop: insets.top,
          paddingHorizontal: BAR_PAD_H,
          paddingBottom: 24,
        }}>
        {/* Inspect: 448×56, padding 0 16, justify space-between — área útil 416×56 */}
        <View
          style={{
            width: '100%',
            height: BAR_ROW_H,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: BAR_BG,
            marginHorizontal: -BAR_PAD_H,
            paddingHorizontal: BAR_PAD_H,
            ...barShadow,
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            onPress={onBackPress}
            style={{ width: 44, height: BAR_ROW_H, justifyContent: 'center', alignItems: 'flex-start' }}>
            <FontAwesome name="chevron-left" size={20} color="#FFFFFF" />
          </Pressable>
          <View
            style={{
              position: 'absolute',
              left: BAR_PAD_H + 44,
              right: BAR_PAD_H + 44,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            pointerEvents="none">
            <Text
              numberOfLines={1}
              className="text-center text-base font-semibold text-white"
              style={{
                maxWidth: '100%',
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
              }}>
              {professional.name}
            </Text>
          </View>
          <View style={{ width: 44, height: BAR_ROW_H }} />
        </View>

        <View className="items-center" style={{ paddingTop: BAR_TO_AVATAR_GAP }}>
          <View
            style={[
              { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_RADIUS },
              avatarShadow,
            ]}>
            <View
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_RADIUS,
                borderWidth: AVATAR_BORDER,
                borderColor: AVATAR_BORDER_COLOR,
                overflow: 'hidden',
              }}>
              <Image
                source={{ uri: professional.avatarUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          </View>
          <Text className="mt-4 text-center text-xl font-extrabold uppercase tracking-wide text-white">
            {professional.name}
          </Text>
          <View className="mt-1 flex-row items-center justify-center" style={{ gap: 6 }}>
            <FontAwesome name="star" size={14} color={STAR_GOLD} />
            <Text
              className="text-center text-base text-white"
              style={{ ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}) }}>
              {professional.headline}
            </Text>
          </View>
          <View className="mt-1 flex-row items-center justify-center" style={{ gap: 6, maxWidth: '92%', alignSelf: 'center' }}>
            <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.92)" />
            <Text className="shrink text-center text-sm text-white/90">{professional.affiliation}</Text>
          </View>
          <View className="mt-1 flex-row items-center justify-center" style={{ gap: 6 }}>
            <Ionicons name="calendar-outline" size={15} color="rgba(255,255,255,0.85)" />
            <Text
              className="text-center text-sm text-white/85"
              style={{ ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}) }}>
              Membro desde: {professional.memberSince}
            </Text>
          </View>
          <View className="mt-2 flex-row items-center" style={{ gap: 6 }}>
            <Ionicons name="people-outline" size={16} color="rgba(255,255,255,0.92)" />
            <Text className="text-sm text-white/90">{professional.followers} seguidores</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        style={{ width: '100%', maxWidth: BAR_MAX_W, alignSelf: 'center' }}
        contentContainerStyle={{
          paddingHorizontal: BAR_PAD_H,
          paddingTop: CARD_GAP,
          paddingBottom: 24,
          gap: CARD_GAP,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Cartão EXPERTISE — mesmo padrão que os outros (Figma) */}
        <View style={cardStyle}>
          <Text className="mb-3 text-sm font-bold uppercase tracking-wide text-forum-ink">🎯 EXPERTISE</Text>
          <View className="flex-row flex-wrap" style={{ gap: 10 }}>
            {professional.expertise.map((tag) => (
              <View
                key={tag}
                className="rounded-full border px-4 py-2"
                style={{ borderColor: '#C6D2FF', backgroundColor: 'rgba(163, 179, 255, 0.18)' }}>
                <Text className="text-xs font-semibold" style={{ color: '#432DD7' }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={cardStyle}>
          <Text className="mb-3 text-sm font-bold uppercase tracking-wide text-forum-ink">🏆 CONQUISTAS</Text>
          {professional.achievements.map((line) => (
            <View key={line} className="mb-2 flex-row items-start">
              <FontAwesome name="check-circle" size={18} color="#22C55E" style={{ marginTop: 1 }} />
              <Text className="ml-2 flex-1 text-sm leading-5 text-forum-ink">{line}</Text>
            </View>
          ))}
        </View>

        {/* Figma: 2×2 — Website | GitHub / LinkedIn | Email */}
        <View style={cardStyle}>
          <Text className="mb-3 text-sm font-bold uppercase tracking-wide text-forum-ink">💼 CONTATO</Text>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => abrirLink(professional.contact.website)}
                className="flex-1 items-center py-3 active:opacity-80"
                style={{
                  borderRadius: CONTACT_BTN_R,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#BFDBFE',
                  backgroundColor: '#EFF6FF',
                }}>
                <FontAwesome name="globe" size={20} color="#2563EB" />
                <Text className="mt-1 text-xs font-semibold text-lads-blue">Website</Text>
              </Pressable>
              <Pressable
                onPress={() => abrirLink(professional.contact.github)}
                className="flex-1 items-center py-3 active:opacity-80"
                style={{
                  borderRadius: CONTACT_BTN_R,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  backgroundColor: '#F3F4F6',
                }}>
                <FontAwesome name="github" size={22} color="#374151" />
                <Text className="mt-1 text-xs font-semibold text-forum-ink">GitHub</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => abrirLink(professional.contact.linkedin)}
                className="flex-1 items-center py-3 active:opacity-80"
                style={{
                  borderRadius: CONTACT_BTN_R,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#BFDBFE',
                  backgroundColor: '#EFF6FF',
                }}>
                <FontAwesome name="linkedin-square" size={22} color="#2563EB" />
                <Text className="mt-1 text-xs font-semibold text-lads-blue">LinkedIn</Text>
              </Pressable>
              <Pressable
                onPress={() => abrirLink(professional.contact.email)}
                className="flex-1 items-center py-3 active:opacity-80"
                style={{
                  borderRadius: CONTACT_BTN_R,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#FECACA',
                  backgroundColor: '#FEF2F2',
                }}>
                <FontAwesome name="envelope-o" size={20} color="#DC2626" />
                <Text className="mt-1 text-xs font-semibold text-red-600">Email</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View className="flex-row" style={{ gap: 8 }}>
          <Pressable
            onPress={onPressSolicitar ?? onPressSolicitarDefault}
            className="min-w-0 flex-1 items-center py-3 active:opacity-90"
            style={{
              borderRadius: ACTION_BTN_R,
              overflow: 'hidden',
              backgroundColor: '#4F39F6',
            }}>
            <FontAwesome name="briefcase" size={16} color="#FFF" />
            <Text className="mt-1 text-center text-[11px] font-bold text-white">Solicitar Serviço</Text>
          </Pressable>
          <Pressable
            onPress={onPressSeguir ?? (() => setSeguindo((v) => !v))}
            className="min-w-0 flex-1 items-center py-3 active:opacity-80"
            style={{
              borderRadius: ACTION_BTN_R,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: '#4F39F6',
              backgroundColor: seguindo ? '#4F39F6' : '#FFFFFF',
            }}>
            <FontAwesome name={seguindo ? 'check' : 'user-plus'} size={16} color={seguindo ? '#FFFFFF' : '#4F39F6'} />
            <Text className="mt-1 text-center text-[11px] font-bold" style={{ color: seguindo ? '#FFFFFF' : '#4F39F6' }}>
              {seguindo ? 'Seguindo' : 'Seguir'}
            </Text>
          </Pressable>
          <Pressable
            onPress={onPressMensagem ?? onPressMensagemDefault}
            className="min-w-0 flex-1 items-center bg-white py-3 active:opacity-80"
            style={{
              borderRadius: ACTION_BTN_R,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: '#4F39F6',
            }}>
            <FontAwesome name="comment-o" size={16} color="#4F39F6" />
            <Text className="mt-1 text-center text-[11px] font-bold" style={{ color: '#4F39F6' }}>
              Enviar Msg
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ForumBottomNav active="profis" accent="blue" />

      <LadsModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        buttons={modal.buttons}
        onRequestClose={closeModal}
      />
    </View>
  );
}
