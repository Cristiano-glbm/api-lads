import { FontAwesome } from '@expo/vector-icons';
import { Image, Platform, Pressable, Text, View } from 'react-native';

import type { ForumPost, ForumReply } from '@/types/forum';
import { bundledImageSource } from '@/utils/bundledImageSource';

import { ForumCommentIcon12 } from './ForumCommentIcon12';
import { ForumPostChevronVector16 } from './ForumPostChevronVector16';
import { ForumThumbsUpIcon12 } from './ForumThumbsUpIcon12';

export interface ForumPostCardProps {
  post: ForumPost;
  onPress?: () => void;
  onPressAuthor?: () => void;
  onDelete?: () => void;
}

const CARD_SHADOW_WEB = {
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
} as const;

const CARD_SHADOW_NATIVE = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
} as const;

/** Coluna de texto ao lado do ícone — largura Fill ~313,87; altura Hug (sem clip no Figma) */
const FORUM_POST_TEXT_COL_W = 313.867;
/** Referência de altura mínima do miolo (título+autor+stats numa linha); o cartão cresce com mais linhas */
const FORUM_POST_TEXT_COL_MIN_H = 61.25;
/** `Container` interno com stats: gap 12 no Figma */
const FORUM_POST_STATS_GAP = 12;
/**
 * Container da seta (16×16) no Figma: relativo ao `# Button`, **Y: 16** (topo do frame).
 * O miolo do botão começa após `paddingVertical: 12` ⇒ **16 − 12 = 4** a partir do topo da fila.
 */
const FORUM_POST_CHEVRON_MARGIN_TOP = 4;

/** Chip “Técnico” — texto Figma ~45×16, Inter Medium 12/16, #4F38F6; fundo #EEF2FF; gap 4 com prefixo */
const FORUM_POST_TAG_BG = '#EEF2FF';
const FORUM_POST_TAG_FOREGROUND = '#4F38F6';
const FORUM_POST_TAG_ROW_H = 16;
const FORUM_POST_TAG_LINE_HEIGHT = 16;
const FORUM_POST_TAG_INNER_GAP = 4;
const FORUM_POST_TAG_DOT = 6;

/** Números “18” / “8” — Figma `Text`: ~21,4×18, Inter Medium 12, #6A7282, Y 2 no grupo (gap 4) */
const FORUM_POST_STAT_NUMBER_STYLE = {
  color: '#6A7282',
  fontFamily: 'Inter_500Medium' as const,
  fontSize: 12,
  fontStyle: 'normal' as const,
  fontWeight: '500' as const,
  letterSpacing: 0,
  lineHeight: 18,
};
/**
 * Espaço ícone → título: no layout final do Figma o intervalo **visual** entre o quadrado 36×36
 * e o texto é ~12px (auto layout). O inspect “X: 80” da coluna incluía folga extra; 32px ficava largo
 * com o PNG da lâmpada (transparência à direita).
 */
const FORUM_POST_ROW_PAD_LEFT = 12;
const FORUM_POST_ICON_TO_TEXT_GAP = 12;
/** Gap entre coluna de texto (Fill ~313,87) e o `Container` 16×16 da seta: **X chevron 385,87** − (12+36+12+313,867) ≈ **12** */
const FORUM_POST_TEXT_TO_CHEVRON = 12;

/** Título no Figma (`T …`): Inter Semi Bold 14, line-height 19,3, fill #1E2939; Hug ~20, Fill ~311,87 */
const FORUM_POST_TITLE_COLOR = '#1E2939';
const FORUM_POST_TITLE_LINE_HEIGHT = 19.3;
/** Hug do título no Figma (~20) → `Paragraph` “por …” em Y 21,25 ⇒ espaço 1,25 */
const FORUM_POST_TITLE_AUTHOR_GAP = 21.25 - 20;

/** `T por …` no Figma: Inter Medium 12, line-height 16, fill #6A7282; Hug 98×16 */
const FORUM_POST_AUTHOR_COLOR = '#6A7282';
const FORUM_POST_AUTHOR_LINE_HEIGHT = 16;

/** `Container` 36×36 lâmpada (#EEF2FF, r 10) — PNG exportado do Figma (ícone + fundo) */
const FORUM_POST_ICON_BULB = bundledImageSource(
  require('../../assets/images/forum-post-icon-bulb-36.png'),
);
/** PNG handshake — centrado no slot 36×36 com fundo #FFFBEB */
const FORUM_POST_ICON_HANDSHAKE = bundledImageSource(
  require('../../assets/images/forum-post-icon-handshake-36.png'),
);
/** PNG interrogação — centrado no slot 36×36 com fundo #FFF1F2 */
const FORUM_POST_ICON_QUESTION = bundledImageSource(
  require('../../assets/images/forum-post-icon-question-36.png'),
);

/** Fundo do quadrado 36×36 — Figma (lâmpada usa PNG composto, não aplica aqui) */
function iconSlotBackground(kind: ForumPost['icon']): string {
  switch (kind) {
    case 'bulb':
      return '#EEF2FF';
    case 'handshake':
      return '#FFFBEB';
    default:
      return '#FFF1F2';
  }
}

function ForumPostCardIcon({ kind }: { kind: ForumPost['icon'] }) {
  if (kind === 'bulb') {
    return (
      <Image
        source={FORUM_POST_ICON_BULB}
        style={{ width: 36, height: 36, borderRadius: 10 }}
        resizeMode="cover"
      />
    );
  }
  const source = kind === 'handshake' ? FORUM_POST_ICON_HANDSHAKE : FORUM_POST_ICON_QUESTION;
  return (
    <View
      style={{
        width: 36,
        height: 36,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: iconSlotBackground(kind),
      }}>
      <Image
        source={source}
        style={{ width: 26, height: 26 }}
        resizeMode="contain"
      />
    </View>
  );
}

export function ForumPostCard({ post, onPress, onPressAuthor, onDelete }: ForumPostCardProps) {
  const cardShadow = Platform.OS === 'web' ? CARD_SHADOW_WEB : CARD_SHADOW_NATIVE;

  /**
   * Shell = `Container` do Figma (Design: 416×87,38, padding 1,07, raio 14, fill #FFF, stroke #F3F4F6).
   * O `# Button` (~85,25px) fica *dentro* deste padding; antes a altura 85,25 estava no mesmo nível e apertava o miolo.
   */
  const shellStyle = {
    marginBottom: 0,
    width: '100%' as const,
    maxWidth: 416,
    alignSelf: 'stretch' as const,
    flexShrink: 0,
    minHeight: 87.38,
    padding: 1.07,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    borderRadius: 14,
    borderWidth: 1.07,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    ...cardShadow,
  };

  /**
   * `# Button` no Figma: Fill × 413,87, altura 85,25; X/Y 1,07 no pai; auto layout vertical, gap 12;
   * fill #FFF, raio 0, sem stroke (borda e raio 14 ficam no `Container` pai).
   * paddingVertical 12 + miolo Hug (mín. ~61,25) — altura total mín. 85,25, sem truncar texto.
   */
  const inner = (
    <View
      style={{
        width: '100%',
        minHeight: 85.25,
        paddingVertical: 12,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#FFFFFF',
        borderRadius: 0,
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingLeft: FORUM_POST_ROW_PAD_LEFT,
        }}>
        <View style={{ marginRight: FORUM_POST_ICON_TO_TEXT_GAP, flexShrink: 0 }}>
          <ForumPostCardIcon kind={post.icon} />
        </View>
        <View
          style={{
            width: FORUM_POST_TEXT_COL_W,
            minWidth: 0,
            flexShrink: 1,
            minHeight: FORUM_POST_TEXT_COL_MIN_H,
            backgroundColor: '#FFFFFF',
          }}>
        <Text
          {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
          numberOfLines={2}
          style={{
            color: FORUM_POST_TITLE_COLOR,
            fontFamily: 'Inter_600SemiBold',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: '600',
            letterSpacing: 0,
            lineHeight: FORUM_POST_TITLE_LINE_HEIGHT,
          }}>
          {post.title}
        </Text>
        <Pressable
          onPress={onPressAuthor}
          disabled={!onPressAuthor}
          hitSlop={8}
          style={({ pressed }) => ({
            marginTop: FORUM_POST_TITLE_AUTHOR_GAP,
            opacity: pressed && onPressAuthor ? 0.6 : 1,
            alignSelf: 'flex-start',
          })}>
          <Text
            {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
            style={{
              color: onPressAuthor ? '#432DD7' : FORUM_POST_AUTHOR_COLOR,
              fontFamily: 'Inter_500Medium',
              fontSize: 12,
              fontStyle: 'normal',
              fontWeight: '500',
              letterSpacing: 0,
              lineHeight: FORUM_POST_AUTHOR_LINE_HEIGHT,
              textDecorationLine: onPressAuthor ? 'underline' : 'none',
            }}>
            por {post.author}
          </Text>
        </Pressable>
        <View
          style={{
            marginTop: FORUM_POST_STATS_GAP,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ForumThumbsUpIcon12 />
            <Text
              {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
              style={FORUM_POST_STAT_NUMBER_STYLE}>
              {post.likes}
            </Text>
          </View>
          <View style={{ marginLeft: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ForumCommentIcon12 />
            <Text
              {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
              style={FORUM_POST_STAT_NUMBER_STYLE}>
              {post.comments}
            </Text>
          </View>
          <View
            style={{
              marginLeft: 12,
              height: FORUM_POST_TAG_ROW_H,
              flexDirection: 'row',
              alignItems: 'center',
              gap: FORUM_POST_TAG_INNER_GAP,
              alignSelf: 'flex-start',
              paddingHorizontal: 8,
              borderRadius: 9999,
              backgroundColor: FORUM_POST_TAG_BG,
            }}>
            <View
              style={{
                width: FORUM_POST_TAG_DOT,
                height: FORUM_POST_TAG_DOT,
                borderRadius: FORUM_POST_TAG_DOT / 2,
                backgroundColor: FORUM_POST_TAG_FOREGROUND,
              }}
            />
            <Text
              {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
              style={{
                color: FORUM_POST_TAG_FOREGROUND,
                fontFamily: 'Inter_500Medium',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: '500',
                letterSpacing: 0,
                lineHeight: FORUM_POST_TAG_LINE_HEIGHT,
              }}>
              {post.tag}
            </Text>
          </View>
        </View>
      </View>
        <View style={{ flexShrink: 0, marginLeft: FORUM_POST_TEXT_TO_CHEVRON, alignItems: 'center', gap: 8 }}>
          <View style={{ width: 16, height: 16, marginTop: FORUM_POST_CHEVRON_MARGIN_TOP, alignItems: 'center', justifyContent: 'center' }}>
            <ForumPostChevronVector16 />
          </View>
          {onDelete && (
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); onDelete(); }}
              hitSlop={8}
              style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome name="trash-o" size={14} color="#EF4444" />
            </Pressable>
          )}
        </View>
      </View>

      {post.replies && post.replies.length > 0 && (
        <View style={{ width: '100%', marginTop: 4 }}>
          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 }} />
          {post.replies.map((reply: ForumReply) => (
            <View key={reply.id} style={{ paddingHorizontal: 12, paddingTop: 8 }}>
              <Text
                {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  lineHeight: 16,
                  color: reply.isLads ? '#432DD7' : '#1E2939',
                }}>
                {reply.author}
              </Text>
              <Text
                {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 12,
                  lineHeight: 16,
                  color: '#4B5563',
                  marginTop: 1,
                }}>
                {reply.text}
              </Text>
            </View>
          ))}
          <Pressable
            style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 }}
            onPress={onPress}>
            <Text
              {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
              style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 12,
                lineHeight: 16,
                color: '#432DD7',
              }}>
              Ver todas as respostas ({post.comments}) →
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={shellStyle}
        className="active:opacity-90">
        {inner}
      </Pressable>
    );
  }

  return <View style={shellStyle}>{inner}</View>;
}
