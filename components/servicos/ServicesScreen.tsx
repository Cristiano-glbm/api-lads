import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SERVICE_CATEGORIES, SERVICE_REQUESTS } from '@/constants/servicesMock';

import { ForumBottomNav } from '../forum/ForumBottomNav';
import { LadsTopBar } from '../lads/LadsTopBar';
import { PaperPlaneIcon18 } from '../lads/PaperPlaneIcon18';
import { CategoriasFolderIcon } from './CategoriasFolderIcon';
import { ServiceCategoryCard } from './ServiceCategoryCard';
import { ServiceRequestRow } from './ServiceRequestRow';

export interface ServicesScreenProps {
  onPressSolicitar?: () => void;
}

export function ServicesScreen({ onPressSolicitar }: ServicesScreenProps) {
  const insets = useSafeAreaInsets();

  /** Fundo de página — Inspect do frame Serviços (Figma) */
  const PAGE_BG = '#F9FAFB';
  const SECTION_LABEL = '#1E2939';

  /**
   * Coluna da página (largura Figma 448px centrada).
   * O bloco “Main Content” (`#F9FAFB`, padding 56/64) está no `ScrollView` abaixo.
   */
  const columnStyle = {
    flex: 1,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    width: '100%' as const,
    maxWidth: 448,
    alignSelf: 'center' as const,
    backgroundColor: PAGE_BG,
  };

  /**
   * Inspect Figma (Main Content): `width: 448px; flex: 1 0 0;` + padding / fundo no conteúdo do scroll.
   * Largura: `maxWidth: 448` + `width: '100%'` em ecrãs mais estreitos que 448px. Altura do frame Figma é fluida no RN.
   */
  const figmaMainScrollArea = {
    width: '100%' as const,
    maxWidth: 448,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    minWidth: 0,
    backgroundColor: PAGE_BG,
  } as const;

  const figmaMainScrollContent = {
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 0,
    alignItems: 'flex-start' as const,
    flexGrow: 1,
  };

  /**
   * Inspect Figma (Main Content / Container roxo — título + subtítulo):
   * `display: flex; width: 448px; padding: 16px 16px 0 16px; flex-direction: column;
   * align-items: flex-start; gap: 2px; background: #432DD7;`
   * O frame no Figma tem **altura fixa 90px**, mas isso deixa faixa roxa vazia por baixo do subtítulo
   * e empurra o CTA — em RN usamos **altura intrínseca** (sem `height: 90`).
   */
  const figmaServicesHeaderTextBlock = {
    display: 'flex' as const,
    width: '100%' as const,
    maxWidth: 448,
    alignSelf: 'center' as const,
    flexShrink: 0,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 16,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: 2,
    backgroundColor: '#432DD7',
  } as const;

  const figmaServicesHeadingRow = {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'stretch' as const,
    width: '100%' as const,
    minHeight: 24,
  } as const;

  const figmaServicesSubtitleRow = {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'stretch' as const,
    width: '100%' as const,
    minHeight: 16,
  } as const;

  /**
   * Inspect Figma (Heading “Serviços LADS”):
   * `color: #FFF; font-family: Inter; font-size: 16px; font-style: normal; font-weight: 700; line-height: 24px;`
   */
  const servicesHeadingTypo = {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'normal' as const,
    color: '#FFF',
    letterSpacing: 0,
    flexShrink: 1,
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  };

  /**
   * Inspect Figma (Paragraph — “Solicite e acompanhe…”):
   * `color: #C6D2FF; font-family: Inter; font-size: 12px; font-style: normal; font-weight: 400; line-height: 16px;`
   */
  const servicesSubtitleTypo = {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'normal' as const,
    color: '#C6D2FF',
    letterSpacing: 0,
    flexShrink: 1,
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  };

  /**
   * Inspect Figma (Main Content → coluna Categorias + Requisições):
   * `width: 448px`, padding horizontal 16, `gap: 16`.
   * **Sem `minHeight` enorme** — `minHeight: 869` no scroll obrigava área vazia e piorava o “tudo desce”.
   */
  const figmaServicesMainColumn = {
    display: 'flex' as const,
    width: '100%' as const,
    maxWidth: 448,
    alignSelf: 'center' as const,
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 16,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: 16,
  } as const;

  /** Figma: `box-shadow: 0 4px 6px -1px rgba(0,0,0,.10), 0 2px 4px -2px rgba(0,0,0,.10)` */
  const solicitarCtaShadowWeb = {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)',
  } as const;

  /** Aproximação às duas camadas; 1ª sombra Figma: Y 4, blur 6, spread -1, #000 10% */
  const solicitarCtaShadowNative = {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  } as const;

  /** Figma (cartão CATEGORIAS): `box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)` */
  const categoriasCardShadowWeb = {
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
  } as const;

  const categoriasCardShadowNative = {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  } as const;

  /**
   * Contentor “CATEGORIAS” — padding Figma, `gap: 12`, borda/sombra.
   * Altura = conteúdo (grelha); **sem `minHeight`** para não forçar caixa mais alta que o necessário.
   */
  const figmaCategoriasContainer = {
    display: 'flex' as const,
    width: '100%' as const,
    paddingTop: 17.067,
    paddingRight: 17.067,
    paddingBottom: 1.067,
    paddingLeft: 17.067,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: 12,
    flexShrink: 0,
    alignSelf: 'stretch' as const,
    borderRadius: 14,
    borderWidth: 1.067,
    borderColor: '#F3F4F6',
    borderStyle: 'solid' as const,
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? categoriasCardShadowWeb : categoriasCardShadowNative),
  } as const;

  /**
   * Inspect Figma — texto “MINHAS REQUISIÇÕES” / “CATEGORIAS”:
   * `color: #1E2939; font-weight: 700; font-size: 14px; line-height: 20px;` (142.857%), Inter, `uppercase`.
   */
  const categoriasHeadingTypo = {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'normal' as const,
    color: '#1E2939',
    letterSpacing: 0,
    textTransform: 'uppercase' as const,
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  } as const;

  const categoriasGridRow = {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    alignSelf: 'stretch' as const,
    width: '100%' as const,
  } as const;

  /**
   * Inspect Figma — Heading 2 (“MINHAS REQUISIÇÕES” / “CATEGORIAS”):
   * `display: flex; height: 20px; align-items: center; gap: 4px; flex-shrink: 0; align-self: stretch;`
   * Conteúdo ícone + texto alinhado ao início da linha (padding vem do contentor pai).
   */
  const figmaSectionHeadingRow = {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    justifyContent: 'flex-start' as const,
    alignItems: 'center' as const,
    height: 20,
    gap: 4,
    flexShrink: 0,
    alignSelf: 'stretch' as const,
    width: '100%' as const,
  } as const;

  const figmaCategoriasHeadingRow = figmaSectionHeadingRow;

  const figmaRequisicoesHeadingRow = {
    ...figmaSectionHeadingRow,
  } as const;

  /** Emoji à esquerda do título (📁, 🕒) — 14/20, cor do rótulo. */
  const sectionHeadingIconTypo = {
    fontSize: 14,
    lineHeight: 20,
    color: SECTION_LABEL,
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  } as const;

  /**
   * Lista de pedidos — coluna, `gap: 12`, largura total.
   * **Sem altura fixa** — a altura vem dos cartões; altura fixa + `flex` nos filhos esticava tudo.
   */
  const figmaRequisicoesListContainer = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: 12,
    flexShrink: 0,
    alignSelf: 'stretch' as const,
    width: '100%' as const,
  } as const;

  /**
   * Cartão branco “MINHAS REQUISIÇÕES” — padding Figma, coluna, `gap: 12`, borda/sombra.
   * **Sem `height: 403.333`** — altura fixa deixava caixa branca gigante e empurrava a secção.
   */
  const figmaRequisicoesCard = {
    display: 'flex' as const,
    width: '100%' as const,
    paddingTop: 17.067,
    paddingRight: 17.067,
    paddingBottom: 1.067,
    paddingLeft: 17.067,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: 12,
    flexShrink: 0,
    alignSelf: 'stretch' as const,
    borderRadius: 14,
    borderWidth: 1.067,
    borderColor: '#F3F4F6',
    borderStyle: 'solid' as const,
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? categoriasCardShadowWeb : categoriasCardShadowNative),
  } as const;

  /**
   * Inspect Figma — fundo do botão (gradiente + cantos).
   * O alinhamento ícone + texto fica em `solicitarCtaRow` (flex fiável no web).
   */
  const solicitarCtaGradientInner = {
    alignSelf: 'stretch' as const,
    flexShrink: 0 as const,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden' as const,
  } as const;

  /**
   * Inspect Figma (conteúdo do botão):
   * `display: flex; justify-content: center; align-items: center;` + `gap: 8px`;
   * `flex-direction: row` implícito (ícone à esquerda do texto).
   */
  const solicitarCtaRow = {
    height: 56,
    display: 'flex' as const,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingHorizontal: 16,
  } as const;

  /**
   * Inspect Figma — “SOLICITAR SERVIÇO”: #FFF, Inter 700, 16px / 24px (150%), center, spacing 0.
   * RN: `Inter_700Bold` + `textTransform: 'uppercase'` (cópia em maiúsculas no Figma).
   */
  const servicesCtaLabelTypo = {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'normal' as const,
    color: '#FFF',
    textAlign: 'center' as const,
    letterSpacing: 0,
    textTransform: 'uppercase' as const,
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  };

  return (
    <View className="flex-1" style={{ backgroundColor: PAGE_BG }}>
      <View style={columnStyle}>
        <View
          className="w-full"
          style={{
            paddingTop: insets.top,
            backgroundColor: '#432DD7',
            position: 'relative' as const,
            zIndex: 10,
            overflow: 'visible' as const,
          }}>
          <LadsTopBar logoTint="#432DD7" variant="servicos-figma" />
          <View style={figmaServicesHeaderTextBlock}>
            <View style={figmaServicesHeadingRow}>
              <Text style={servicesHeadingTypo}>🛠️ Serviços LADS</Text>
            </View>
            <View style={figmaServicesSubtitleRow}>
              <Text style={servicesSubtitleTypo}>Solicite e acompanhe seus projetos</Text>
            </View>
          </View>
          <View className="w-full items-center px-4 pb-4">
            <Pressable
              accessibilityRole="button"
              onPress={onPressSolicitar}
              style={{ width: '100%', alignSelf: 'stretch', flexShrink: 0 }}
              className="active:opacity-90">
              <View
                style={[
                  { borderRadius: 14, width: '100%' as const },
                  Platform.OS === 'web' ? solicitarCtaShadowWeb : solicitarCtaShadowNative,
                ]}>
                <LinearGradient
                  colors={['#4F39F6', '#4F39F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={solicitarCtaGradientInner}>
                  <View style={solicitarCtaRow}>
                    <PaperPlaneIcon18 />
                    <Text style={servicesCtaLabelTypo}>SOLICITAR SERVIÇO</Text>
                  </View>
                </LinearGradient>
              </View>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={figmaMainScrollArea}
          contentContainerStyle={figmaMainScrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={figmaServicesMainColumn}>
          <View style={figmaCategoriasContainer}>
            <View style={figmaCategoriasHeadingRow}>
              <View
                collapsable={false}
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  flexGrow: 0,
                  justifyContent: 'center' as const,
                  alignItems: 'center' as const,
                }}>
                <CategoriasFolderIcon size={18} color={SECTION_LABEL} />
              </View>
              <Text style={[categoriasHeadingTypo, { flexShrink: 1, minWidth: 0 }]}>CATEGORIAS</Text>
            </View>
            <View style={categoriasGridRow}>
              {SERVICE_CATEGORIES.map((c) => (
                <ServiceCategoryCard key={c.id} item={c} />
              ))}
            </View>
          </View>

          <View style={figmaRequisicoesCard}>
            <View style={figmaRequisicoesHeadingRow}>
              <Text style={sectionHeadingIconTypo}>🕒</Text>
              <Text style={[categoriasHeadingTypo, { flexShrink: 1, minWidth: 0 }]}>
                MINHAS REQUISIÇÕES
              </Text>
            </View>
            <View style={figmaRequisicoesListContainer}>
              {SERVICE_REQUESTS.map((r) => (
                <ServiceRequestRow key={r.id} item={r} />
              ))}
            </View>
          </View>
          </View>
        </ScrollView>

        <View className="w-full">
          <ForumBottomNav active="inicio" accent="purple" />
        </View>
      </View>
    </View>
  );
}
