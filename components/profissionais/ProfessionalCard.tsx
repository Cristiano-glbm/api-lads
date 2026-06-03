import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Linking, Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';

import type { ProfessionalListItem } from '@/types/professional';

/** Alinhado ao texto secundário do cartão (`text-forum-muted`) */
const AFFILIATION_ICON = '#000000';

/** Figma Inspect — LinkedIn */
const LINK_BLUE = '#1447E6';
/** Figma Inspect — rótulo GitHub */
const GITHUB_SLATE = '#364153';
/** Figma Inspect — CTA Contratar */
const CTA_BG = '#4F39F6';

/** Figma: cantos dos botões de ação — 10px */
const ACTION_BTN_RADIUS = 10;
const ACTION_ICON_TEXT_GAP = 3;

const actionBtnShell = {
  borderRadius: ACTION_BTN_RADIUS,
  overflow: 'hidden' as const,
  gap: ACTION_ICON_TEXT_GAP,
};

const ACTION_LABEL = {
  fontFamily: 'Inter_500Medium',
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: 0,
  ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
} as const;

/** Abaixo disto, 3 botões numa só fila ficam espremidos — 2 linhas (LinkedIn|GitHub + Contratar). */
const ACTION_ROW_STACK_BELOW = 430;

export interface ProfessionalCardProps {
  professional: ProfessionalListItem;
  onPressContratar?: (id: string) => void;
}

export function ProfessionalCard({ professional, onPressContratar }: ProfessionalCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [cardWidth, setCardWidth] = useState(0);
  const widthBasis = cardWidth > 0 ? cardWidth : windowWidth;
  const stackActions = widthBasis < ACTION_ROW_STACK_BELOW;

  return (
    <View
      className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}>
      <View className="flex-row">
        <Image
          source={{ uri: professional.avatarUrl }}
          className="h-16 w-16 rounded-full border border-gray-100"
        />
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-gray-900">{professional.name}</Text>
          <Text className="mt-0.5 text-sm text-forum-primary">
            ⭐ {professional.role}
          </Text>
          <View className="mt-0.5 flex-row items-center" style={{ gap: 5 }}>
            <Ionicons name="location-outline" size={14} color={AFFILIATION_ICON} />
            <Text className="min-w-0 flex-1 text-xs leading-4 text-gray-500" numberOfLines={2}>
              {professional.affiliation}
            </Text>
          </View>
          <View className="mt-1 flex-row items-center" style={{ gap: 4 }}>
            <Ionicons name="people-outline" size={14} color={AFFILIATION_ICON} />
            <Text className="text-xs text-gray-500">{professional.followers} seguidores</Text>
          </View>
        </View>
      </View>

      {stackActions ? (
        <View className="mt-4" style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              onPress={() => professional.linkedinUrl && Linking.openURL(professional.linkedinUrl)}
              className="min-h-[48px] flex-1 flex-row items-center justify-center px-3 py-3 active:opacity-80"
              style={[
                actionBtnShell,
                { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: LINK_BLUE },
              ]}>
              <FontAwesome name="linkedin-square" size={18} color={LINK_BLUE} />
              <Text numberOfLines={1} style={{ ...ACTION_LABEL, color: LINK_BLUE }}>
                LinkedIn
              </Text>
            </Pressable>
            <Pressable
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              onPress={() => professional.githubUrl && Linking.openURL(professional.githubUrl)}
              className="min-h-[48px] flex-1 flex-row items-center justify-center px-3 py-3 active:opacity-80"
              style={[
                actionBtnShell,
                { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#000000' },
              ]}>
              <FontAwesome name="github" size={18} color={GITHUB_SLATE} />
              <Text numberOfLines={1} style={{ ...ACTION_LABEL, color: GITHUB_SLATE }}>
                GitHub
              </Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            onPress={() => onPressContratar?.(professional.id)}
            className="min-h-[48px] w-full flex-row items-center justify-center px-3 py-3 active:opacity-90"
            style={[actionBtnShell, { backgroundColor: CTA_BG }]}>
            <FontAwesome name="user-plus" size={18} color="#ffffff" />
            <Text numberOfLines={1} style={{ ...ACTION_LABEL, color: '#FFFFFF' }}>
              Contratar
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="mt-4 flex-row" style={{ gap: 8 }}>
          <Pressable
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            onPress={() => professional.linkedinUrl && Linking.openURL(professional.linkedinUrl)}
            className="min-h-[48px] min-w-0 flex-1 flex-row items-center justify-center px-3 py-3 active:opacity-80"
            style={[
              actionBtnShell,
              { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: LINK_BLUE },
            ]}>
            <FontAwesome name="linkedin-square" size={18} color={LINK_BLUE} />
            <Text numberOfLines={1} style={{ ...ACTION_LABEL, color: LINK_BLUE }}>
              LinkedIn
            </Text>
          </Pressable>
          <Pressable
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            onPress={() => professional.githubUrl && Linking.openURL(professional.githubUrl)}
            className="min-h-[48px] min-w-0 flex-1 flex-row items-center justify-center px-3 py-3 active:opacity-80"
            style={[
              actionBtnShell,
              { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#000000' },
            ]}>
            <FontAwesome name="github" size={18} color={GITHUB_SLATE} />
            <Text numberOfLines={1} style={{ ...ACTION_LABEL, color: GITHUB_SLATE }}>
              GitHub
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            onPress={() => onPressContratar?.(professional.id)}
            className="min-h-[48px] min-w-0 flex-1 flex-row items-center justify-center px-3 py-3 active:opacity-90"
            style={[actionBtnShell, { backgroundColor: CTA_BG }]}>
            <FontAwesome name="user-plus" size={18} color="#000000" />
            <Text numberOfLines={1} style={{ ...ACTION_LABEL, color: '#000000' }}>
              Contratar
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
