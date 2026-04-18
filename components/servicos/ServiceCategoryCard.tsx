import { FontAwesome } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';

import { CATEGORY_LEAD_IMAGES } from '@/constants/categoryLeadImages';
import type { ServiceCategoryItem } from '@/types/service';

export interface ServiceCategoryCardProps {
  item: ServiceCategoryItem;
  onPress?: () => void;
}

/**
 * Inspect Figma (cartão categoria):
 * `display: flex; width: 186.933px; height: 98.633px; padding: 12px 0 12px 12px;`
 * `flex-direction: column; align-items: flex-start; gap: 4px;`
 * `border-radius: 14px; border: 1.067px solid …; background: …` (cores por `item`).
 * Na grelha: `width: 100%` + `maxWidth: 186.933` para não estourar em ecrãs estreitos.
 */
export function ServiceCategoryCard({ item, onPress }: ServiceCategoryCardProps) {
  const leadImage = CATEGORY_LEAD_IMAGES[item.id];

  const shell = {
    display: 'flex' as const,
    flexGrow: 1,
    flexBasis: 0,
    minWidth: '42%' as const,
    width: '100%' as const,
    maxWidth: 186.933,
    minHeight: 98.633,
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: 4,
    borderRadius: 14,
    borderWidth: 1.067,
    borderColor: item.borderColor,
    borderStyle: 'solid' as const,
    backgroundColor: item.surfaceColor,
  } as const;

  /** Figma: título alinhado à esquerda (auto-layout `align-items: flex-start`). */
  const titleRow = {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    justifyContent: 'flex-start' as const,
    alignItems: 'flex-start' as const,
    alignSelf: 'stretch' as const,
    minHeight: item.id === 'mobile' || item.id === 'ia' ? 17 : 16.5,
    paddingTop: 2,
    paddingBottom: 2,
  } as const;

  /**
   * Título “Mobile” / “IA/ML” (12/16.5) vs restantes (14/18). IA/ML: `#8200DB`, Inter 600.
   */
  const titleTypo =
    item.id === 'mobile'
      ? {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
          lineHeight: 16.5,
          fontStyle: 'normal' as const,
          color: '#008236',
          textAlign: 'left' as const,
          ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
        }
      : item.id === 'ia'
        ? {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 12,
            lineHeight: 16.5,
            fontStyle: 'normal' as const,
            color: '#8200DB',
            textAlign: 'left' as const,
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          }
        : {
            fontFamily: 'Inter_700Bold',
            fontSize: 14,
            lineHeight: 18,
            fontStyle: 'normal' as const,
            color: item.iconColor,
            textAlign: 'left' as const,
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          };

  /** Contagem — mesma coluna à esquerda (Figma). */
  const countRow = {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    justifyContent: 'flex-start' as const,
    alignItems: 'center' as const,
    alignSelf: 'stretch' as const,
    minHeight: item.id === 'mobile' ? 18 : 16,
  } as const;

  /** Contagem: Inter 500, 12/16; IA/Mobile com cores de tema. */
  const countTypo =
    item.id === 'mobile'
      ? {
          fontFamily: 'Inter_500Medium',
          fontSize: 12,
          lineHeight: 16,
          fontStyle: 'normal' as const,
          color: '#008236',
          textAlign: 'left' as const,
          ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
        }
      : item.id === 'ia'
        ? {
            fontFamily: 'Inter_500Medium',
            fontSize: 12,
            lineHeight: 16,
            fontStyle: 'normal' as const,
            color: '#8200DB',
            textAlign: 'left' as const,
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          }
        : {
            fontFamily: 'Inter_500Medium',
            fontSize: 12,
            lineHeight: 16,
            fontStyle: 'normal' as const,
            color: item.iconColor,
            textAlign: 'left' as const,
            ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
          };

  /**
   * Emoji opcional: o glifo 💻 (e outros) vem da fonte do sistema — iOS/Android/Web
   * desenham telas/cores diferentes; para bater com o Figma use ícone vectorial (`icon`) ou SVG exportado.
   */
  const categoryEmojiTypo = {
    fontFamily: 'Inter_500Medium',
    fontSize: 24,
    lineHeight: 32,
    fontStyle: 'normal' as const,
    textAlign: 'left' as const,
    color: item.emojiColor ?? item.iconColor,
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  } as const;

  /** Faixa do ícone/emoji — alinhada à esquerda (Inspect Figma: `align-items: flex-start`). */
  const categoryLeadSlot = {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    justifyContent: 'flex-start' as const,
    alignItems: 'flex-start' as const,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    alignSelf: 'stretch' as const,
    minHeight: 36,
    width: '100%' as const,
  } as const;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[shell, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : undefined]}>
      {leadImage != null ? (
        <View style={categoryLeadSlot}>
          <Image
            accessibilityIgnoresInvertColors
            source={leadImage}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </View>
      ) : item.emoji ? (
        <View style={categoryLeadSlot}>
          <Text style={categoryEmojiTypo}>{item.emoji}</Text>
        </View>
      ) : (
        <View style={categoryLeadSlot}>
          <FontAwesome
            name={item.icon as ComponentProps<typeof FontAwesome>['name']}
            size={22}
            color={item.iconColor}
          />
        </View>
      )}
      <View style={titleRow}>
        <Text style={[titleTypo, { alignSelf: 'stretch', width: '100%' }]} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
      <View style={countRow}>
        <Text style={countTypo}>{item.countLabel}</Text>
      </View>
    </Pressable>
  );
}
