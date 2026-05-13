import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Polyline } from 'react-native-svg';

import { FORUM_FILTERS, FORUM_HOME_HEADER } from '@/constants/forumMock';
import type { ForumCategory } from '@/types/forum';
import * as forumService from '@/services/forumService';

import { ForumBackArrowIcon20 } from './ForumBackArrowIcon20';
import { ForumBottomNav, FORUM_BOTTOM_NAV_ROW_HEIGHT } from './ForumBottomNav';
import { LinearGradient } from 'expo-linear-gradient';

const MAX_WIDTH = 448;
const androidNoPad = Platform.OS === 'android' ? { includeFontPadding: false as const } : {};

const CARD_SHADOW_WEB = {
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
} as const;
const CARD_SHADOW_NATIVE = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
  elevation: 2,
} as const;

const CATEGORIES = FORUM_FILTERS.filter((f) => f !== 'Geral') as Exclude<ForumCategory, 'Geral'>[];

function PencilIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckIcon({ color = '#6B7280' }: { color?: string }) {
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

function Checkbox({ checked, onPress }: { checked: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: checked ? '#432DD7' : '#D1D5DB',
        backgroundColor: checked ? '#432DD7' : '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
      {checked ? <CheckIcon color="#FFFFFF" /> : null}
    </Pressable>
  );
}

export function ForumNovoTopicoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<Exclude<ForumCategory, 'Geral'>>(CATEGORIES[0]);
  const [descricao, setDescricao] = useState('');
  const [urgente, setUrgente] = useState(false);
  const [apenasMemb, setApenasMemb] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);

  const cardShadow = Platform.OS === 'web' ? CARD_SHADOW_WEB : CARD_SHADOW_NATIVE;
  const scrollBottomPad = 20 + FORUM_BOTTOM_NAV_ROW_HEIGHT + Math.max(insets.bottom, 0);

  const podePubulicar = titulo.trim().length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* Cabeçalho */}
      <View style={{ width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', paddingTop: insets.top }}>
        <View
          style={{
            height: 56,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#432DD7',
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={12}
            onPress={() => router.back()}
            style={{ width: 40, height: 40, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
            <ForumBackArrowIcon20 color="#FFFFFF" />
          </Pressable>
          <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
            <Text
              {...androidNoPad}
              numberOfLines={1}
              style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 20 }}>
              Novo Tópico - {FORUM_HOME_HEADER.eventName}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={['#8200DB', '#432DD7']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <PencilIcon />
          </View>
          <View>
            <Text {...androidNoPad} style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 20 }}>
              Criar Novo Tópico
            </Text>
            <Text {...androidNoPad} style={{ color: '#E9D4FF', fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16 }}>
              {FORUM_HOME_HEADER.eventName} • Fórum
            </Text>
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{ flex: 1, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' }}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: scrollBottomPad }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Formulário */}
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, gap: 14, ...cardShadow }}>
            {/* Título */}
            <View>
              <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18, color: '#374151', marginBottom: 6 }}>
                Título:
              </Text>
              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Qual linguagem usar na madrugada?"
                placeholderTextColor="#9CA3AF"
                style={{
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
                }}
              />
            </View>

            {/* Categoria */}
            <View>
              <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18, color: '#374151', marginBottom: 6 }}>
                Categoria:
              </Text>
              <Pressable
                onPress={() => setShowCatPicker((v) => !v)}
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: '#FAFAFA',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#1E2939' }}>
                  {categoria}
                </Text>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Pressable>
              {showCatPicker && (
                <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginTop: 4, backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => { setCategoria(cat); setShowCatPicker(false); }}
                      style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: cat === categoria ? '#432DD7' : '#1E2939' }}>
                        {cat}
                      </Text>
                      {cat === categoria ? <CheckIcon color="#432DD7" /> : null}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Descrição */}
            <View>
              <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18, color: '#374151', marginBottom: 6 }}>
                Descrição:
              </Text>
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva seu tópico em detalhes..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontFamily: 'Inter_400Regular',
                  fontSize: 14,
                  lineHeight: 20,
                  color: '#1E2939',
                  backgroundColor: '#FAFAFA',
                  minHeight: 100,
                }}
              />
            </View>

            {/* Divisor */}
            <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />

            {/* Marcar como Urgente */}
            <Pressable
              onPress={() => setUrgente((v) => !v)}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <Checkbox checked={urgente} onPress={() => setUrgente((v) => !v)} />
              <View style={{ flex: 1 }}>
                <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 18, color: '#1E2939' }}>
                  Marcar como Urgente
                </Text>
                <Text {...androidNoPad} style={{ fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16, color: '#6B7280', marginTop: 2 }}>
                  Aparecerá no topo das discussões
                </Text>
              </View>
            </Pressable>

            {/* Permitir apenas Membros */}
            <Pressable
              onPress={() => setApenasMemb((v) => !v)}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <Checkbox checked={apenasMemb} onPress={() => setApenasMemb((v) => !v)} />
              <View style={{ flex: 1 }}>
                <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 18, color: '#1E2939' }}>
                  Permitir apenas Membros
                </Text>
                <Text {...androidNoPad} style={{ fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16, color: '#6B7280', marginTop: 2 }}>
                  Restrito a membros do LADS
                </Text>
              </View>
            </Pressable>

            {/* Botões */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 8,
                  paddingVertical: 11,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6,
                  backgroundColor: '#FFFFFF',
                  opacity: pressed ? 0.85 : 1,
                })}>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#374151' }}>✕  Cancelar</Text>
              </Pressable>
              <Pressable
                disabled={!podePubulicar}
                onPress={async () => {
                  try {
                    await forumService.createPost({ title: titulo, content: descricao, tag: categoria });
                  } catch { /* navigate anyway */ }
                  router.back();
                }}
                style={({ pressed }) => ({
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 11,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6,
                  backgroundColor: podePubulicar ? '#432DD7' : '#E5E7EB',
                  opacity: pressed ? 0.88 : 1,
                })}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: podePubulicar ? '#FFFFFF' : '#9CA3AF' }}>✓  Publicar</Text>
              </Pressable>
            </View>
          </View>

          {/* Dicas */}
          <View style={{ backgroundColor: '#EEF2FF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#C7D2FE' }}>
            <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18, color: '#432DD7', marginBottom: 6 }}>
              💡 Dicas para um bom tópico:
            </Text>
            {[
              'Use um título claro e descritivo',
              'Escolha a categoria adequada',
              'Forneça contexto na descrição',
            ].map((dica) => (
              <Text key={dica} {...androidNoPad} style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, color: '#4338CA' }}>
                • {dica}
              </Text>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ForumBottomNav active="forum" />
    </View>
  );
}
