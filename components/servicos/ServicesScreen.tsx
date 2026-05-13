import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SERVICE_CATEGORIES, SERVICE_REQUESTS } from '@/constants/servicesMock';
import type { ServiceRequestItem } from '@/types/service';
import type { ApiServiceRequest } from '@/services/servicesService';
import * as servicesService from '@/services/servicesService';
import { ForumBottomNav, FORUM_BOTTOM_NAV_ROW_HEIGHT } from '../forum/ForumBottomNav';
import { LadsModal } from '../lads/LadsModal';
import { LadsTopBar } from '../lads/LadsTopBar';
import { PaperPlaneIcon18 } from '../lads/PaperPlaneIcon18';
import { ServiceCategoryCard } from './ServiceCategoryCard';
import { ServiceRequestRow } from './ServiceRequestRow';

export interface ServicesScreenProps {
  onPressSolicitar?: () => void;
}

function mapApiRequest(r: ApiServiceRequest): ServiceRequestItem {
  const statusMap: Record<string, 'concluido' | 'progresso' | 'orcamento'> = {
    CONCLUIDO: 'concluido',
    PROGRESSO: 'progresso',
    ORCAMENTO: 'orcamento',
    CANCELADO: 'orcamento',
  };
  const status = statusMap[r.status] ?? 'orcamento';
  const title = r.title ?? r.service?.title ?? 'Solicitação';

  let meta = 'Aguardando resposta...';
  if (status === 'concluido') {
    meta = `Entregue: ${new Date(r.updatedAt).toLocaleDateString('pt-BR')}`;
  } else if (status === 'progresso') {
    meta = r.prazo ? `Prazo: ${r.prazo}` : `Desde: ${new Date(r.createdAt).toLocaleDateString('pt-BR')}`;
  }

  return { id: r.id, title, status, meta };
}

export function ServicesScreen({ onPressSolicitar }: ServicesScreenProps) {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<ServiceRequestItem[]>(SERVICE_REQUESTS);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, title: '', message: '', confirmed: false });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      servicesService.getMyRequests()
        .then((list) => {
          if (!active) return;
          if (list.length > 0) setRequests(list.map(mapApiRequest));
          else setRequests([]);
        })
        .catch(() => { if (active) setRequests(SERVICE_REQUESTS); })
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, []),
  );

  function closeModal() { setModal((m) => ({ ...m, visible: false })); }

  function handleSolicitar() {
    setModal({ visible: true, title: '🛠️ Solicitar Serviço', message: 'Escolha a categoria do serviço que deseja solicitar:', confirmed: false });
  }

  async function cancelarRequisicao(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    try { await servicesService.cancelRequest(id); } catch { /* silent */ }
  }

  /** Fundo de página — Inspect do frame Serviços (Figma) */
  const PAGE_BG = '#F9FAFB';

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

  /** Espaço extra abaixo do CTA sobreposto + lista + barra inferior (Expo Go) */
  const scrollBottomPad = 24 + FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 12);

  const figmaMainScrollContent = {
    /** Respiro abaixo do CTA sobreposto até ao 1.º cartão (Figma ~16px) */
    paddingTop: 16,
    paddingBottom: scrollBottomPad,
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
    paddingBottom: 12,
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

  /** Metade do CTA (56px) “entra” no roxo; o restante fica sobre o fundo cinza (Figma). */
  const CTA_OVERLAP = 28;

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
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
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

  const categoriasGridRow = {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    alignSelf: 'stretch' as const,
    width: '100%' as const,
  } as const;

  /**
   * Cabeçalhos de secção (“CATEGORIAS”, “MINHAS REQUISIÇÕES”) — Figma: ícone cinza + título
   * em maiúsculas à esquerda, alinhado ao conteúdo da grelha / lista.
   */
  const servicosSectionHeadingRow = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'stretch' as const,
    width: '100%' as const,
    gap: 6,
    minHeight: 22,
  } as const;

  const servicosSectionHeadingIconSlot = {
    width: 20,
    height: 20,
    flexShrink: 0,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as const;

  const servicosSectionTitleTypo = {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'normal' as const,
    color: '#1E2939',
    letterSpacing: 0,
    textTransform: 'uppercase' as const,
    flexShrink: 1,
    flex: 1,
    minWidth: 0,
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
    gap: 16,
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
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
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
      <View style={[columnStyle, { flex: 1, minHeight: 0 }]}>
        <View
          className="w-full"
          style={{
            paddingTop: insets.top,
            backgroundColor: '#432DD7',
            position: 'relative' as const,
            zIndex: 10,
            overflow: 'visible' as const,
            paddingBottom: CTA_OVERLAP,
          }}>
          <LadsTopBar logoTint="#432DD7" variant="servicos-figma" />
          <View style={figmaServicesHeaderTextBlock}>
            <View style={figmaServicesHeadingRow}>
              <Text style={servicesHeadingTypo}>🛠️ Serviços - LADS</Text>
            </View>
            <View style={figmaServicesSubtitleRow}>
              <Text style={servicesSubtitleTypo}>Solicite e acompanhe seus projetos</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: -CTA_OVERLAP,
            marginBottom: 12,
            paddingHorizontal: 16,
            width: '100%',
            maxWidth: 448,
            alignSelf: 'center',
            zIndex: 20,
          }}>
          <Pressable
            accessibilityRole="button"
            onPress={onPressSolicitar ?? handleSolicitar}
            style={{ width: '100%', alignSelf: 'stretch', flexShrink: 0 }}
            className="active:opacity-90">
            <View
              style={[
                { borderRadius: 14, width: '100%' as const },
                Platform.OS === 'web' ? solicitarCtaShadowWeb : solicitarCtaShadowNative,
              ]}>
              <LinearGradient
                colors={['#5B21B6', '#4F39F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={solicitarCtaGradientInner}>
                <View style={solicitarCtaRow}>
                  <PaperPlaneIcon18 />
                  <Text style={servicesCtaLabelTypo}>SOLICITAR SERVIÇO</Text>
                </View>
              </LinearGradient>
            </View>
          </Pressable>
        </View>

        <ScrollView
          style={[figmaMainScrollArea, { flex: 1, minHeight: 0 }]}
          contentContainerStyle={figmaMainScrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={figmaServicesMainColumn}>
          <View style={figmaCategoriasContainer}>
            <View style={servicosSectionHeadingRow}>
              <View style={servicosSectionHeadingIconSlot}>
                <MaterialCommunityIcons name="folder" size={16} color="#475569" />
              </View>
              <Text accessibilityRole="header" style={servicosSectionTitleTypo}>
                Categorias
              </Text>
            </View>
            <View style={categoriasGridRow}>
              {SERVICE_CATEGORIES.map((c) => (
                <ServiceCategoryCard key={c.id} item={c} />
              ))}
            </View>
          </View>

          <View style={figmaRequisicoesCard}>
            <View style={servicosSectionHeadingRow}>
              <View style={servicosSectionHeadingIconSlot}>
                <FontAwesome name="clock-o" size={16} color="#64748B" />
              </View>
              <Text accessibilityRole="header" style={servicosSectionTitleTypo}>
                Minhas requisições
              </Text>
            </View>
            <View style={figmaRequisicoesListContainer}>
              {loading ? (
                <View style={{ alignItems: 'center', paddingVertical: 24, width: '100%' }}>
                  <ActivityIndicator size="small" color="#432DD7" />
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#64748B', marginTop: 8 }}>
                    Carregando...
                  </Text>
                </View>
              ) : requests.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 24, width: '100%' }}>
                  <Text style={{ fontSize: 32 }}>📭</Text>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#374151', marginTop: 8 }}>
                    Nenhuma requisição
                  </Text>
                </View>
              ) : (
                requests.map((r) => (
                  <ServiceRequestRow key={r.id} item={r} onPressCancelar={cancelarRequisicao} />
                ))
              )}
            </View>
          </View>
          </View>
        </ScrollView>

        <View className="w-full">
          <ForumBottomNav active="inicio" accent="purple" />
        </View>
      </View>

      <LadsModal
        visible={modal.visible && !modal.confirmed}
        title={modal.title}
        message={modal.message}
        onRequestClose={closeModal}
        buttons={[
          { text: 'Cancelar', style: 'cancel', onPress: closeModal },
          { text: 'Continuar', onPress: () => setModal({ visible: true, title: '✅ Solicitação iniciada!', message: 'Em breve nossa equipe entrará em contato para alinhar os detalhes do projeto.', confirmed: true }) },
        ]}
      />
      <LadsModal
        visible={modal.visible && modal.confirmed}
        title={modal.title}
        message={modal.message}
        onRequestClose={closeModal}
        buttons={[{ text: 'OK', onPress: closeModal }]}
      />
    </View>
  );
}
