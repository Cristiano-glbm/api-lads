import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';

import { LadsModal, type LadsModalButton } from '@/components/lads/LadsModal';

import {
  SERVICE_STATUS_CONCLUIDO,
  SERVICE_STATUS_HOURGLASS,
  SERVICE_STATUS_ORCAMENTO,
} from '@/constants/serviceScreenAssets';
import type { ServiceRequestItem, ServiceRequestStatus } from '@/types/service';

import { ServiceAcompanharEyeIcon } from './ServiceAcompanharEyeIcon';
import { ServiceContatarMessageIcon } from './ServiceContatarMessageIcon';
import { ServiceEditarPencilIcon } from './ServiceEditarPencilIcon';

/** Títulos e corpo — alinhado a tokens comuns do Inspect (Figma) */
const HEADING = '#1E2939';
const META = '#64748B';

const CTA_PURPLE = '#432DD7';

/** Badge “Orçamento” — tokens do Figma (fundo creme, borda âmbar, texto laranja). */
const ORCAMENTO_BADGE_BG = '#FFFBEB';
const ORCAMENTO_BADGE_BORDER = '#FBD38D';
const ORCAMENTO_BADGE_TEXT = '#DD6B20';

/**
 * Zona de toque mínima recomendada em mobile (≈44pt iOS HIG / Material ~48dp).
 * `minHeight` (não altura fixa) evita cortar texto com fonte dinâmica maior.
 */
const MOBILE_CTA_MIN_HEIGHT = 44;
const MOBILE_CTA_TWIN_GAP = 8;
const MOBILE_CTA_ICON_TEXT_GAP = 6;

/**
 * Botão único “Detalhes” (concluído): no Figma costuma ser um pouco mais baixo que os duplos.
 * Mantemos toque confortável com `hitSlop` (área sensível maior que a caixa desenhada).
 */
const DETALHES_CTA_MIN_HEIGHT = 40;
const detalhesHitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;

const ctaButtonTextBase = {
  fontFamily: 'Inter_600SemiBold' as const,
  fontSize: 13,
  lineHeight: 16,
  flexShrink: 1,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
};

/** box-shadow Figma: `0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)` */
const whiteIconElevation = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
} as const;

/** Inspect Figma: ícone de estado à esquerda da linha — cápsula 32×32. */
const FIGMA_ROW_STATUS_ICON_SHELL = {
  width: 32,
  height: 32,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  flexShrink: 0 as const,
  borderRadius: 10,
  backgroundColor: '#FFFFFF',
  ...whiteIconElevation,
} as const;

/**
 * Inspect Figma — cartão “MINHAS REQUISIÇÕES”:
 * padding, coluna, `gap: 8`, borda, `maxWidth: '100%'`.
 * **Sem `flex: 1 0 0`** — no Figma isso era “Fill” dentro de um frame com altura fixa; no RN fazia
 * cada cartão **crescer** até ~⅓ da lista e empurrava o resto do ecrã para baixo.
 */
const REQUEST_CARD_SHELL = {
  display: 'flex' as const,
  width: '100%' as const,
  maxWidth: '100%' as const,
  alignSelf: 'stretch' as const,
  flexShrink: 0,
  paddingTop: 13.067,
  paddingRight: 13.067,
  paddingBottom: 13.067,
  paddingLeft: 13.067,
  flexDirection: 'column' as const,
  alignItems: 'flex-start' as const,
  gap: 8,
  borderRadius: 14,
  borderWidth: 1.067,
  borderColor: '#F3F4F6',
  borderStyle: 'solid' as const,
  backgroundColor: '#FFFFFF',
} as const;

const REQUEST_CARD_HEADER_ROW = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  alignSelf: 'stretch' as const,
  gap: 8,
} as const;

const REQUEST_CARD_TITLE_CLUSTER = {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  alignItems: 'center' as const,
  gap: 8,
  minWidth: 0,
} as const;

export interface ServiceRequestRowProps {
  item: ServiceRequestItem;
  onPressCancelar?: (id: string) => void;
}

function StatusBadge({ status }: { status: ServiceRequestStatus }) {
  if (status === 'concluido') {
    return (
      <View className="rounded-full border border-green-300 bg-green-50 px-2.5 py-0.5">
        <Text
          className="text-[11px] font-semibold text-green-700"
          maxFontSizeMultiplier={1.35}
          numberOfLines={1}>
          Concluído
        </Text>
      </View>
    );
  }
  if (status === 'progresso') {
    return (
      <View className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5">
        <Text
          className="text-[11px] font-semibold text-blue-700"
          maxFontSizeMultiplier={1.35}
          numberOfLines={1}>
          Em Progresso
        </Text>
      </View>
    );
  }
  return (
    <View
      style={{
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: ORCAMENTO_BADGE_BORDER,
        backgroundColor: ORCAMENTO_BADGE_BG,
        paddingHorizontal: 10,
        paddingVertical: 2,
      }}>
      <Text
        maxFontSizeMultiplier={1.35}
        numberOfLines={1}
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: 11,
          lineHeight: 14,
          color: ORCAMENTO_BADGE_TEXT,
          ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
        }}>
        Orçamento
      </Text>
    </View>
  );
}

function RowIcon({ status }: { status: ServiceRequestStatus }) {
  if (status === 'concluido') {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Concluído"
        style={{
          width: 32,
          height: 32,
          flexShrink: 0,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
        }}>
        <Image
          accessibilityIgnoresInvertColors
          source={SERVICE_STATUS_CONCLUIDO}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
      </View>
    );
  }
  if (status === 'progresso') {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Em progresso"
        style={FIGMA_ROW_STATUS_ICON_SHELL}>
        <Image
          accessibilityIgnoresInvertColors
          source={SERVICE_STATUS_HOURGLASS}
          style={{ width: 22, height: 22 }}
          resizeMode="contain"
        />
      </View>
    );
  }
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Orçamento"
      style={FIGMA_ROW_STATUS_ICON_SHELL}>
      <Image
        accessibilityIgnoresInvertColors
        source={SERVICE_STATUS_ORCAMENTO}
        style={{ width: 22, height: 22 }}
        resizeMode="contain"
      />
    </View>
  );
}

export function ServiceRequestRow({ item, onPressCancelar }: ServiceRequestRowProps) {
  const metaItalic = item.status === 'orcamento';
  const [modal, setModal] = useState<{ visible: boolean; title: string; message: string; buttons: LadsModalButton[] }>({
    visible: false, title: '', message: '', buttons: [],
  });
  function closeModal() { setModal((m) => ({ ...m, visible: false })); }
  function showModal(title: string, message: string, buttons: LadsModalButton[]) {
    setModal({ visible: true, title, message, buttons });
  }

  function handleDetalhes() {
    showModal(
      `📋 ${item.title}`,
      `Status: Concluído\n${item.meta}\n\nTodas as entregas foram aceitas e o projeto foi finalizado com sucesso.`,
      [{ text: 'Fechar', onPress: closeModal }],
    );
  }

  function handleAcompanhar() {
    showModal(
      `👁️ Acompanhar — ${item.title}`,
      `Status: Em Progresso\n${item.meta}\n\n• Design aprovado ✅\n• Desenvolvimento: 65% ⏳\n• Testes: aguardando 🔄`,
      [{ text: 'Fechar', onPress: closeModal }],
    );
  }

  function handleContatar() {
    showModal(
      `💬 Contatar — ${item.title}`,
      'Como deseja entrar em contato com o prestador?',
      [
        { text: 'Cancelar', style: 'cancel', onPress: closeModal },
        {
          text: 'Enviar mensagem',
          onPress: () => showModal('✉️ Mensagem enviada!', 'O prestador receberá sua mensagem em breve.', [{ text: 'OK', onPress: closeModal }]),
        },
      ],
    );
  }

  function handleEditar() {
    showModal(
      `✏️ Editar — ${item.title}`,
      'Em breve você poderá editar os detalhes da sua requisição diretamente pelo app. 🚀',
      [{ text: 'Entendido', onPress: closeModal }],
    );
  }

  function handleCancelar() {
    showModal(
      'Cancelar requisição',
      `Tem certeza que deseja cancelar "${item.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Voltar', style: 'cancel', onPress: closeModal },
        { text: 'Cancelar', style: 'destructive', onPress: () => { closeModal(); onPressCancelar?.(item.id); } },
      ],
    );
  }

  return (
    <View style={REQUEST_CARD_SHELL}>
      <View style={REQUEST_CARD_HEADER_ROW}>
        <RowIcon status={item.status} />
        <View style={REQUEST_CARD_TITLE_CLUSTER}>
          <Text
            className="text-base font-bold"
            style={{ color: HEADING }}
            numberOfLines={2}
            ellipsizeMode="tail"
            maxFontSizeMultiplier={1.35}>
            {item.title}
          </Text>
          <StatusBadge status={item.status} />
        </View>
      </View>
      <Text
        className={`text-sm ${metaItalic ? 'italic' : ''}`}
        style={{ color: META, alignSelf: 'stretch' }}
        numberOfLines={2}
        ellipsizeMode="tail"
        maxFontSizeMultiplier={1.35}>
        {item.meta}
      </Text>

      {item.status === 'concluido' && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver detalhes do pedido"
          hitSlop={detalhesHitSlop}
          onPress={handleDetalhes}
          android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
          style={({ pressed }) => ({
            alignSelf: 'stretch',
            minHeight: DETALHES_CTA_MIN_HEIGHT,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            backgroundColor: pressed ? '#F3F4F6' : '#F8F9FA',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 12,
          })}>
          <ServiceAcompanharEyeIcon color={HEADING} size={15} variant="onMuted" />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            maxFontSizeMultiplier={1.35}
            style={{ ...ctaButtonTextBase, color: HEADING, marginLeft: MOBILE_CTA_ICON_TEXT_GAP }}>
            Detalhes
          </Text>
        </Pressable>
      )}

      {item.status === 'progresso' && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'stretch',
            width: '100%',
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Acompanhar pedido"
            onPress={handleAcompanhar}
            style={({ pressed }) => ({
              flex: 1,
              minWidth: 0,
              minHeight: MOBILE_CTA_MIN_HEIGHT,
              borderRadius: 12,
              backgroundColor: pressed ? '#3730A3' : CTA_PURPLE,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
              marginRight: MOBILE_CTA_TWIN_GAP,
            })}>
            <ServiceAcompanharEyeIcon color="#FFFFFF" size={16} variant="onBrand" />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.35}
              style={{ ...ctaButtonTextBase, color: '#FFFFFF', marginLeft: MOBILE_CTA_ICON_TEXT_GAP }}>
              Acompanhar
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Contatar"
            onPress={handleContatar}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            style={({ pressed }) => ({
              flex: 1,
              minWidth: 0,
              minHeight: MOBILE_CTA_MIN_HEIGHT,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              backgroundColor: pressed ? '#F3F4F6' : '#FFFFFF',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
            })}>
            <ServiceContatarMessageIcon size={15} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.35}
              style={{ ...ctaButtonTextBase, color: HEADING, marginLeft: MOBILE_CTA_ICON_TEXT_GAP }}>
              Contatar
            </Text>
          </Pressable>
        </View>
      )}

      {item.status === 'orcamento' && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'stretch',
            width: '100%',
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar pedido"
            onPress={handleEditar}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            style={({ pressed }) => ({
              flex: 1,
              minWidth: 0,
              minHeight: MOBILE_CTA_MIN_HEIGHT,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              backgroundColor: pressed ? '#F3F4F6' : '#FFFFFF',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
              marginRight: MOBILE_CTA_TWIN_GAP,
            })}>
            <ServiceEditarPencilIcon color={HEADING} size={15} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.35}
              style={{ ...ctaButtonTextBase, color: HEADING, marginLeft: MOBILE_CTA_ICON_TEXT_GAP }}>
              Editar
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancelar pedido"
            onPress={handleCancelar}
            android_ripple={{ color: 'rgba(220,38,38,0.12)' }}
            style={({ pressed }) => ({
              flex: 1,
              minWidth: 0,
              minHeight: MOBILE_CTA_MIN_HEIGHT,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#FECACA',
              backgroundColor: pressed ? '#FEE2E2' : '#FEF2F2',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
            })}>
            <FontAwesome name="times-circle" size={14} color="#DC2626" />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.35}
              style={{ ...ctaButtonTextBase, color: '#DC2626', marginLeft: MOBILE_CTA_ICON_TEXT_GAP }}>
              Cancelar
            </Text>
          </Pressable>
        </View>
      )}

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
