import { FontAwesome } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { ServiceRequestItem, ServiceRequestStatus } from '@/types/service';

/** Títulos e corpo — alinhado a tokens comuns do Inspect (Figma) */
const HEADING = '#1E2939';
const META = '#64748B';

const FORUM_PRIMARY = '#4F38F6';

/** Inspect Figma (entre ícone e label no botão): ~7,47×20, flex-shrink 0 */
const ICON_LABEL_GAP = {
  width: 7.467,
  height: 20,
  flexShrink: 0,
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
 * Inspect Figma — cápsula do ícone dentro dos botões (ex. olho em “Acompanhar”):
 * `display: flex; width: 33.067px; height: 32px; padding: 0 4.067px 3.067px 5px;
 * justify-content: center; align-items: center;` + mesma sombra.
 */
const FIGMA_ACTION_ICON_BTN_SHELL = {
  display: 'flex' as const,
  width: 33.067,
  height: 32,
  paddingTop: 0,
  paddingRight: 4.067,
  paddingBottom: 3.067,
  paddingLeft: 5,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  flexShrink: 0 as const,
  borderRadius: 10,
  backgroundColor: '#FFFFFF',
  ...whiteIconElevation,
} as const;

const ICON_BTN_SHELL = FIGMA_ACTION_ICON_BTN_SHELL;

/**
 * Inspect Figma — cartão “MINHAS REQUISIÇÕES”:
 * padding, coluna, `gap: 8`, borda, `maxWidth: '100%'`.
 * **Sem `flex: 1 0 0`** — no Figma isso era “Fill” dentro de um frame com altura fixa; no RN fazia
 * cada cartão **crescer** até ~⅓ da lista e empurrava o resto do ecrã para baixo.
 */
const REQUEST_CARD_SHELL = {
  display: 'flex' as const,
  width: 381.867,
  maxWidth: '100%' as const,
  alignSelf: 'stretch' as const,
  flexShrink: 0,
  paddingTop: 13.067,
  paddingRight: 13.067,
  paddingBottom: 1.067,
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
}

function StatusBadge({ status }: { status: ServiceRequestStatus }) {
  if (status === 'concluido') {
    return (
      <View className="rounded-full border border-green-300 bg-green-50 px-2.5 py-0.5">
        <Text className="text-[11px] font-semibold text-green-700">Concluído</Text>
      </View>
    );
  }
  if (status === 'progresso') {
    return (
      <View className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5">
        <Text className="text-[11px] font-semibold text-blue-700">Em Progresso</Text>
      </View>
    );
  }
  return (
    <View className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5">
      <Text className="text-[11px] font-semibold text-amber-800">Orçamento</Text>
    </View>
  );
}

function RowIcon({ status }: { status: ServiceRequestStatus }) {
  if (status === 'concluido') {
    return (
      <View accessible accessibilityRole="image" accessibilityLabel="Concluído" style={FIGMA_ROW_STATUS_ICON_SHELL}>
        <FontAwesome name="check" size={18} color="#16A34A" />
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
        <FontAwesome name="trophy" size={16} color="#CA8A04" />
      </View>
    );
  }
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Orçamento"
      style={FIGMA_ROW_STATUS_ICON_SHELL}>
      <FontAwesome name="file-text-o" size={16} color={HEADING} />
    </View>
  );
}

export function ServiceRequestRow({ item }: ServiceRequestRowProps) {
  const metaItalic = item.status === 'orcamento';

  return (
    <View style={REQUEST_CARD_SHELL}>
      <View style={REQUEST_CARD_HEADER_ROW}>
        <RowIcon status={item.status} />
        <View style={REQUEST_CARD_TITLE_CLUSTER}>
          <Text className="text-base font-bold" style={{ color: HEADING }}>
            {item.title}
          </Text>
          <StatusBadge status={item.status} />
        </View>
      </View>
      <Text
        className={`text-sm ${metaItalic ? 'italic' : ''}`}
        style={{ color: META, alignSelf: 'stretch' }}>
        {item.meta}
      </Text>

      {item.status === 'concluido' && (
        <Pressable className="flex-row items-center gap-2 self-start rounded-lg border border-gray-200 bg-[#F8F9FA] px-3 py-2 active:opacity-80">
          <FontAwesome name="eye" size={15} color={HEADING} />
          <Text className="text-sm font-semibold" style={{ color: HEADING }}>
            Detalhes
          </Text>
        </Pressable>
      )}

      {item.status === 'progresso' && (
        <View className="flex-row gap-2" style={{ alignSelf: 'stretch' }}>
          <Pressable
            accessibilityRole="button"
            className="flex-row items-start justify-center rounded-xl bg-forum-primary active:opacity-90"
            style={{ width: 80.8, height: 32 }}>
            <View style={ICON_BTN_SHELL}>
              <FontAwesome name="eye" size={14} color={FORUM_PRIMARY} />
            </View>
            <View style={ICON_LABEL_GAP} />
            <Text className="text-xs font-semibold text-white" numberOfLines={1}>
              Acompanhar
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            className="flex-1 flex-row items-start justify-center rounded-xl border border-gray-300 bg-white px-2 active:opacity-80"
            style={{ height: 32 }}>
            <View style={ICON_BTN_SHELL}>
              <FontAwesome name="comment-o" size={14} color={HEADING} />
            </View>
            <View style={ICON_LABEL_GAP} />
            <Text className="text-xs font-semibold" style={{ color: HEADING }} numberOfLines={1}>
              Contatar
            </Text>
          </Pressable>
        </View>
      )}

      {item.status === 'orcamento' && (
        <View className="flex-row gap-2" style={{ alignSelf: 'stretch' }}>
          <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-2.5 active:opacity-80">
            <FontAwesome name="pencil" size={14} color={HEADING} />
            <Text className="text-sm font-semibold" style={{ color: HEADING }}>
              Editar
            </Text>
          </Pressable>
          <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 active:opacity-80">
            <FontAwesome name="times-circle" size={14} color="#DC2626" />
            <Text className="text-sm font-semibold text-red-600">Cancelar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
