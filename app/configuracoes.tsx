import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Fragment } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SettingItem = {
  ion: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  red: boolean;
  iconBg: string;
  iconColor: string;
  onPress?: () => void;
};

const ICON_SLOT = 40;
const ICON_TEXT_GAP = 12;
const ROW_MIN_H = 65;
const LINE_INSET = ICON_SLOT + ICON_TEXT_GAP;
const SEP_COLOR = '#F9FAFB';

const cardShadowWeb = { boxShadow: '0 1px 3px 0 rgba(0,0,0,.10), 0 1px 2px -1px rgba(0,0,0,.10)' } as const;
const cardShadowNative = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
} as const;
const cardShadow = Platform.OS === 'web' ? cardShadowWeb : cardShadowNative;

export default function ConfiguracoesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const SETTINGS: SettingItem[] = [
    {
      ion: 'person-outline',
      title: 'Editar Perfil',
      subtitle: 'Atualizar informações pessoais',
      red: false,
      iconBg: '#ECECF4',
      iconColor: '#6366F1',
    },
    {
      ion: 'lock-closed-outline',
      title: 'Privacidade',
      subtitle: 'Controle de visibilidade',
      red: false,
      iconBg: '#ECECF4',
      iconColor: '#6366F1',
    },
    {
      ion: 'notifications-outline',
      title: 'Notificações',
      subtitle: 'Preferências de alertas',
      red: false,
      iconBg: '#ECECF4',
      iconColor: '#6366F1',
      onPress: () => router.push('/notificacoes'),
    },
    {
      ion: 'log-out-outline',
      title: 'Sair',
      subtitle: 'Encerrar sessão',
      red: true,
      iconBg: '#FEE8E8',
      iconColor: '#EF4444',
      onPress: () => router.replace('/login'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
      {/* Fundo semi-transparente fecha ao tocar */}
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={() => router.back()}
      />

      {/* Painel */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 12,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom, 24) + 8,
          maxWidth: 448,
          alignSelf: 'center',
          width: '100%',
          ...cardShadow,
        }}>
        {/* Alça */}
        <View
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#E5E7EB',
            alignSelf: 'center',
            marginBottom: 20,
          }}
        />

        {/* Título */}
        <Text
          style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 15,
            lineHeight: 22,
            color: '#111827',
            marginBottom: 4,
            ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
          }}>
          Configurações
        </Text>

        {/* Itens */}
        {SETTINGS.map((item, idx) => {
          const showChevron = item.ion !== 'log-out-outline';
          return (
            <Fragment key={item.title}>
              <Pressable
                accessibilityRole="button"
                onPress={item.onPress ?? (() => router.back())}
                android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: ICON_TEXT_GAP,
                  minHeight: ROW_MIN_H,
                  paddingVertical: 12,
                  width: '100%',
                  backgroundColor: pressed ? SEP_COLOR : 'transparent',
                  borderRadius: 10,
                })}>
                <View
                  style={{
                    width: ICON_SLOT,
                    height: ICON_SLOT,
                    borderRadius: ICON_SLOT / 2,
                    backgroundColor: item.iconBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name={item.ion} size={20} color={item.iconColor} />
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      fontFamily: 'Inter_700Bold',
                      fontSize: 15,
                      lineHeight: 22,
                      color: item.red ? '#EF4444' : '#111827',
                      ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                      lineHeight: 16,
                      color: '#6A7282',
                      marginTop: 1,
                      ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
                    }}>
                    {item.subtitle}
                  </Text>
                </View>

                {showChevron && <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />}
              </Pressable>

              {idx < SETTINGS.length - 1 && (
                <View style={{ flexDirection: 'row', paddingLeft: LINE_INSET }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: SEP_COLOR }} />
                </View>
              )}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}
