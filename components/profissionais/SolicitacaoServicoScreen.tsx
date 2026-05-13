import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import * as servicesService from '@/services/servicesService';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Polyline } from 'react-native-svg';

import { ForumBottomNav, FORUM_BOTTOM_NAV_ROW_HEIGHT } from '@/components/forum/ForumBottomNav';
import { LadsModal } from '@/components/lads/LadsModal';

const ACCENT = '#4F39F6';

function formatCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
const androidNoPad = Platform.OS === 'android' ? { includeFontPadding: false as const } : {};

const CARD_SHADOW =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)' } as object)
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      };

const CATEGORIAS = ['Design', 'Desenvolvimento', 'Consultoria', 'Marketing', 'Redação', 'Outro'] as const;
type Categoria = (typeof CATEGORIAS)[number];

function BackArrow({ color = '#FFF' }: { color?: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronDown() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon({ color = '#FFF' }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="20 6 9 17 4 12"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FileIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="#6B7280"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline points="14 2 14 8 20 8" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const FIELD_STYLE = {
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontFamily: 'Inter_400Regular',
  fontSize: 14,
  lineHeight: 20,
  color: '#1E2939',
  backgroundColor: '#FAFAFA',
} as const;

const LABEL_STYLE = {
  fontFamily: 'Inter_600SemiBold',
  fontSize: 13,
  lineHeight: 18,
  color: '#374151',
  marginBottom: 6,
} as const;

export function SolicitacaoServicoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Design');
  const [descricao, setDescricao] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [prazo, setPrazo] = useState('');
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAnexoModal, setShowAnexoModal] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const scrollBottomPad = 20 + FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 0);
  const podeSalvar = titulo.trim().length > 0;

  async function handleSalvar() {
    try {
      await servicesService.createRequest({
        title: titulo,
        categoria,
        descricao,
        orcamento,
        prazo,
      });
    } catch { /* show toast regardless */ }
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => router.back());
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <View style={{ width: '100%', maxWidth: 448, alignSelf: 'center', paddingTop: insets.top }}>
        <View
          style={{
            height: 56,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: ACCENT,
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={12}
            onPress={() => router.back()}
            style={{ width: 40, height: 40, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
            <BackArrow />
          </Pressable>
          <Text
            {...androidNoPad}
            numberOfLines={1}
            style={{ flex: 1, color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 16, lineHeight: 22 }}>
            Solicitação de Serviço
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{ flex: 1, width: '100%', maxWidth: 448, alignSelf: 'center' }}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: scrollBottomPad }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Formulário */}
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, gap: 14, ...CARD_SHADOW }}>

            {/* Título */}
            <View>
              <Text {...androidNoPad} style={LABEL_STYLE}>Título:</Text>
              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Digite o nome da solicitação"
                placeholderTextColor="#9CA3AF"
                style={FIELD_STYLE}
              />
            </View>

            {/* Categoria */}
            <View>
              <Text {...androidNoPad} style={LABEL_STYLE}>Categoria:</Text>
              <Pressable
                onPress={() => setShowCatPicker((v) => !v)}
                style={{
                  ...FIELD_STYLE,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#1E2939' }}>
                  {categoria}
                </Text>
                <ChevronDown />
              </Pressable>
              {showCatPicker && (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    marginTop: 4,
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                  }}>
                  {CATEGORIAS.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => { setCategoria(cat); setShowCatPicker(false); }}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: cat === CATEGORIAS[CATEGORIAS.length - 1] ? 0 : 1,
                        borderBottomColor: '#F3F4F6',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Inter_400Regular',
                          fontSize: 14,
                          color: cat === categoria ? ACCENT : '#1E2939',
                        }}>
                        {cat}
                      </Text>
                      {cat === categoria ? <CheckIcon color={ACCENT} /> : null}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Descrição */}
            <View>
              <Text {...androidNoPad} style={LABEL_STYLE}>Descrição:</Text>
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva seu tópico em detalhes..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={{
                  ...FIELD_STYLE,
                  minHeight: 100,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              />
            </View>

            {/* Orçamento */}
            <View>
              <Text {...androidNoPad} style={LABEL_STYLE}>Orçamento:</Text>
              <TextInput
                value={orcamento}
                onChangeText={(text) => setOrcamento(formatCurrency(text))}
                placeholder="R$ 0,00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={FIELD_STYLE}
              />
            </View>

            {/* Prazo */}
            <View>
              <Text {...androidNoPad} style={LABEL_STYLE}>Prazo:</Text>
              <TextInput
                value={prazo}
                onChangeText={(text) => setPrazo(formatDate(text))}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
                style={FIELD_STYLE}
              />
            </View>

            {/* Anexo */}
            <View>
              <Text {...androidNoPad} style={LABEL_STYLE}>Anexo</Text>
              <Pressable
                onPress={() => setShowAnexoModal(true)}
                style={({ pressed }) => ({
                  ...FIELD_STYLE,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  opacity: pressed ? 0.8 : 1,
                })}>
                <FileIcon />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#6B7280' }}>
                  Escolher arquivo
                </Text>
              </Pressable>
            </View>

            {/* Divisor */}
            <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />

            {/* Botões */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => setShowCancelModal(true)}
                style={({ pressed }) => ({
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: '#EF4444',
                  borderRadius: 8,
                  paddingVertical: 11,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6,
                  backgroundColor: '#FFFFFF',
                  opacity: pressed ? 0.85 : 1,
                })}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#EF4444' }}>✕  Cancelar</Text>
              </Pressable>
              <Pressable
                disabled={!podeSalvar}
                onPress={handleSalvar}
                style={({ pressed }) => ({
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 11,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6,
                  backgroundColor: podeSalvar ? '#22C55E' : '#E5E7EB',
                  opacity: pressed ? 0.88 : 1,
                })}>
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 14,
                    color: podeSalvar ? '#FFFFFF' : '#9CA3AF',
                  }}>
                  ✓  Salvar
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: insets.top + 72,
          left: 16,
          right: 16,
          alignItems: 'center',
          zIndex: 99,
          opacity: toastOpacity,
        }}>
        <View
          style={{
            backgroundColor: '#22C55E',
            borderRadius: 999,
            paddingVertical: 12,
            paddingHorizontal: 20,
            maxWidth: 360,
          }}>
          <Text
            {...androidNoPad}
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 14,
              lineHeight: 20,
              color: '#FFFFFF',
              textAlign: 'center',
            }}>
            Serviço solicitado. Por favor, verifique{'\n'}seu e-mail para mais informações
          </Text>
        </View>
      </Animated.View>

      <ForumBottomNav active="profis" />

      <LadsModal
        visible={showAnexoModal}
        title="Anexar arquivo"
        message="Upload de arquivos será disponibilizado em breve."
        onRequestClose={() => setShowAnexoModal(false)}
        buttons={[{ text: 'OK', onPress: () => setShowAnexoModal(false) }]}
      />

      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 320,
              alignItems: 'center',
              ...(Platform.OS === 'web'
                ? { boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }
                : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 10 }),
            }}>
            <Text
              {...androidNoPad}
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                lineHeight: 24,
                color: '#1E2939',
                textAlign: 'center',
                marginBottom: 24,
              }}>
              Tem certeza que deseja{'\n'}cancelar esta solicitação?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <Pressable
                onPress={() => setShowCancelModal(false)}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: '#EF4444',
                  borderRadius: 999,
                  paddingVertical: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#FFFFFF' }}>NÃO</Text>
              </Pressable>
              <Pressable
                onPress={() => { setShowCancelModal(false); router.back(); }}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: '#22C55E',
                  borderRadius: 999,
                  paddingVertical: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#FFFFFF' }}>SIM</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
