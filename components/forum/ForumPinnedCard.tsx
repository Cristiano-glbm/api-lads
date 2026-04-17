import { Image, Platform, Text, View } from 'react-native';

import type { ForumPinnedPost } from '@/types/forum';
import { bundledImageSource } from '@/utils/bundledImageSource';

import { ForumCommentIcon12 } from './ForumCommentIcon12';
import { ForumPinnedPinIcon14 } from './ForumPinnedPinIcon14';
import { ForumThumbsUpIcon12 } from './ForumThumbsUpIcon12';

/** Coluna dos ícones (alfinete, like) — alinhamento vertical Figma */
const FORUM_PINNED_ICON_COL_W = 14;
/** Espaço entre coluna de ícones e texto (linha “Fixado” / stats) */
const FORUM_PINNED_ICON_TEXT_GAP = 8;
/** Texto “Fixado” — frame Inspect Figma */
const FORUM_PINNED_FIXADO_TEXT_W = 39;
const FORUM_PINNED_FIXADO_TEXT_H = 16;
/**
 * Espaço entre a linha “Fixado” (~16px) e o bloco do título.
 * No Figma o título costuma estar ~18px do topo do miolo → sobra ~2px entre Fixado e Dicas.
 */
const FORUM_PINNED_TITLE_MARGIN_TOP = 2;
/** Linha do título — frame horizontal Figma */
const FORUM_PINNED_TITLE_ROW_WIDTH = 367.867;
const FORUM_PINNED_TITLE_ROW_HEIGHT = 20;
/** Raster exportado do Figma (sol/estrela). `bundledImageSource(require)` — web precisa de `{ uri }`, não string solta no `source`. */
const FORUM_PINNED_TITLE_SOL_PX = 20;
const FORUM_PINNED_TITLE_SOL_TEXT_GAP = 8;

/** Padding — Inspect Figma: 13.067 13.067 1.067 13.067 */
const FORUM_PINNED_PAD_H = 13.067;
const FORUM_PINNED_PAD_TOP = 13.067;
const FORUM_PINNED_PAD_BOTTOM = 1.067;
/** Largura / altura fixas do frame no Figma */
const FORUM_PINNED_CARD_WIDTH = 416;
const FORUM_PINNED_CARD_HEIGHT = 104.1333;
const FORUM_PINNED_BORDER_W = 1.067;
/**
 * Miolo: altura exata do conteúdo entre paddings do card (Inspect).
 * 104,1333 − 13,067 (top) − 1,067 (bottom) ≈ 90px — evita caixa interna menor que o frame.
 */
const FORUM_PINNED_INNER_HEIGHT =
  FORUM_PINNED_CARD_HEIGHT - FORUM_PINNED_PAD_TOP - FORUM_PINNED_PAD_BOTTOM;

/** Início da coluna de texto (14 + 8) — alinha “Fixado” / título / autor / stats no Figma */
const FORUM_PINNED_TEXT_COLUMN_LEFT = 22;
/** Linha de stats (4º container): altura / gap do Inspect; largura = coluna texto (até 367,867) */
const FORUM_PINNED_STATS_ROW_HEIGHT = 16;
const FORUM_PINNED_STATS_ROW_GAP = 12;
const FORUM_PINNED_STAT_CLUSTER_GAP = 4;

const FORUM_PINNED_AUTHOR_ROW_HEIGHT = 16;
/**
 * Espaço entre “por …” e a linha de likes/comentários (auto-layout Figma).
 * Antes era 0 — o miolo ainda tem folga vertical; não precisa aumentar a altura do card.
 */
const FORUM_PINNED_AUTHOR_STATS_GAP = 8;

export interface ForumPinnedCardProps {
  post: ForumPinnedPost;
}

export function ForumPinnedCard({ post }: ForumPinnedCardProps) {
  const titleAndroid = Platform.OS === 'android' ? { includeFontPadding: false } : {};

  return (
    <View
      style={{
        marginBottom: 0,
        width: '100%',
        maxWidth: FORUM_PINNED_CARD_WIDTH,
        height: FORUM_PINNED_CARD_HEIGHT,
        flexShrink: 0,
        alignSelf: 'stretch',
        paddingTop: FORUM_PINNED_PAD_TOP,
        paddingRight: FORUM_PINNED_PAD_H,
        paddingBottom: FORUM_PINNED_PAD_BOTTOM,
        paddingLeft: FORUM_PINNED_PAD_H,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: 14,
        borderWidth: FORUM_PINNED_BORDER_W,
        borderColor: '#FEE685',
        backgroundColor: '#FFFBEB',
      }}>
      <View
        style={{
          width: '100%',
          minWidth: 0,
          height: FORUM_PINNED_INNER_HEIGHT,
          flexShrink: 0,
          alignSelf: 'stretch',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
      {/* Linha Fixado — altura 16px fixa (texto Fixado 16px), evita “meio” extra antes do título */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 16,
          marginBottom: 0,
          alignSelf: 'stretch',
        }}>
        <View
          style={{
            width: FORUM_PINNED_ICON_COL_W,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ForumPinnedPinIcon14 />
        </View>
        <Text
          {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
          style={{
            marginLeft: FORUM_PINNED_ICON_TEXT_GAP,
            width: FORUM_PINNED_FIXADO_TEXT_W,
            height: FORUM_PINNED_FIXADO_TEXT_H,
            color: '#E17100',
            fontFamily: 'Inter_500Medium',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: '500',
            letterSpacing: 0,
            lineHeight: 16,
          }}>
          Fixado
        </Text>
      </View>

      {/* Título: coluna 22px + bloco ≤367,867 (Figma); texto com largura real — sem “caixa” de 80px */}
      <View
        style={{
          marginTop: FORUM_PINNED_TITLE_MARGIN_TOP,
          marginBottom: 2,
          flexShrink: 0,
          alignSelf: 'stretch',
          flexDirection: 'row',
          alignItems: 'flex-start',
          minHeight: 0,
        }}>
        <View style={{ width: FORUM_PINNED_TEXT_COLUMN_LEFT, flexShrink: 0 }} />
        <View
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            minWidth: 0,
            maxWidth: FORUM_PINNED_TITLE_ROW_WIDTH,
            height: FORUM_PINNED_TITLE_ROW_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            gap: FORUM_PINNED_TITLE_SOL_TEXT_GAP,
          }}>
          <Image
            accessibilityRole="image"
            accessibilityLabel="Sol"
            source={bundledImageSource(require('../../assets/images/forum-pinned-sol.png'))}
            style={{
              width: FORUM_PINNED_TITLE_SOL_PX,
              height: FORUM_PINNED_TITLE_SOL_PX,
              flexShrink: 0,
            }}
            resizeMode="contain"
          />
          <Text
            {...titleAndroid}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              flexGrow: 1,
              flexShrink: 1,
              minWidth: 0,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 14,
              fontStyle: 'normal',
              fontWeight: '600',
              letterSpacing: 0,
              lineHeight: 20,
              color: '#1E2939',
            }}>
            {post.title}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexShrink: 0,
          alignSelf: 'stretch',
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 0,
        }}>
        <View style={{ width: FORUM_PINNED_TEXT_COLUMN_LEFT, flexShrink: 0 }} />
        <View
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            minWidth: 0,
            maxWidth: FORUM_PINNED_TITLE_ROW_WIDTH,
            height: FORUM_PINNED_AUTHOR_ROW_HEIGHT,
            justifyContent: 'center',
          }}>
          <Text
            {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: '#6A7282',
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              fontStyle: 'normal',
              fontWeight: '400',
              letterSpacing: 0,
              lineHeight: 16,
            }}>
            por {post.author}
          </Text>
        </View>
      </View>

      {/* 4º container Figma: linha likes/comentários — altura 16, gap 12, ícone 12×12 centrado na linha */}
      <View
        style={{
          marginTop: FORUM_PINNED_AUTHOR_STATS_GAP,
          flexShrink: 0,
          alignSelf: 'stretch',
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 0,
        }}>
        <View style={{ width: FORUM_PINNED_TEXT_COLUMN_LEFT, flexShrink: 0 }} />
        <View
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            minWidth: 0,
            maxWidth: FORUM_PINNED_TITLE_ROW_WIDTH,
            height: FORUM_PINNED_STATS_ROW_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            gap: FORUM_PINNED_STATS_ROW_GAP,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: FORUM_PINNED_STAT_CLUSTER_GAP,
            }}>
            <ForumThumbsUpIcon12 />
            <Text
              {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
              style={{
                color: '#6A7282',
                fontFamily: 'Inter_500Medium',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: '500',
                letterSpacing: 0,
                lineHeight: 18,
              }}>
              {post.likes}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: FORUM_PINNED_STAT_CLUSTER_GAP,
            }}>
            <ForumCommentIcon12 />
            <Text
              {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}
              style={{
                color: '#6A7282',
                fontFamily: 'Inter_500Medium',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: '500',
                letterSpacing: 0,
                lineHeight: 18,
              }}>
              {post.comments}
            </Text>
          </View>
        </View>
      </View>
      </View>
    </View>
  );
}
