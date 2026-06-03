import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AUTH_BG_GRADIENT,
  AUTH_BTN_BORDER,
  AUTH_BTN_FILL,
  AUTH_LINK_COLOR,
  authAndroidFont,
  authButtonShadow,
  authCardShadow,
  authFieldLabelStyle,
  authTextInputStyle,
} from '@/constants/authScreenTheme';
import { useAuth } from '@/context/AuthContext';

/**
 * Envelope em traço (viewBox 24×24) — componente **inline** neste ficheiro para o Metro
 * não resolver `../components/icons/...` (evita “Unable to resolve module”).
 */
function EnvelopeOutlineIcon({
  size = 56,
  color = '#6B7280',
  strokeWidth = 1.75,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="E-mail"
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

export default function RecuperarSenhaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const androidFont = authAndroidFont();

  async function handleEnviar() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await forgotPassword(email.trim());
    } catch {
      // show success even on error for security reasons
    } finally {
      setLoading(false);
      setEnviado(true);
    }
  }

  const cardShell = {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center' as const,
    ...authCardShadow,
  };

  if (enviado) {
    return (
      <LinearGradient
        colors={AUTH_BG_GRADIENT}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled">
          <View style={cardShell}>
            <Text
              {...androidFont}
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 24,
                lineHeight: 24,
                letterSpacing: 0,
                color: '#000000',
                textAlign: 'center',
                marginBottom: 8,
              }}>
              E-mail enviado!
            </Text>

            <View style={{ alignSelf: 'center', width: '100%', maxWidth: 218, marginBottom: 16 }}>
              <Text
                {...androidFont}
                style={{
                  fontFamily: 'Inter_300Light',
                  fontSize: 15,
                  lineHeight: 15,
                  letterSpacing: 0,
                  color: '#000000',
                  textAlign: 'center',
                }}>
                Verifique sua caixa de entrada
              </Text>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <EnvelopeOutlineIcon size={56} color="#000000" strokeWidth={1.5} />
            </View>

            <View style={{ alignSelf: 'center', width: '100%', maxWidth: 293, marginBottom: 24 }}>
              <Text
                {...androidFont}
                style={{
                  fontFamily: 'Inter_300Light',
                  fontSize: 15,
                  lineHeight: 18,
                  letterSpacing: 0,
                  color: '#000000',
                  textAlign: 'center',
                }}>
                Enviamos um link de redefinição de senha para o seu e-mail. Por favor, verifique sua caixa de entrada e
                siga as instruções para redefinir sua senha.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.replace('/login')}
              activeOpacity={0.8}
              style={{
                backgroundColor: '#2563EB',
                borderRadius: 10,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                {...androidFont}
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  color: '#FFFFFF',
                  fontSize: 14,
                  letterSpacing: 0,
                }}>
                Voltar para o login
              </Text>
            </TouchableOpacity>

            <Text
              {...androidFont}
              style={{
                marginTop: 20,
                textAlign: 'center',
                alignSelf: 'center',
                maxWidth: 233,
                fontSize: 15,
                lineHeight: 15,
                letterSpacing: 0,
              }}>
              <Text style={{ fontFamily: 'Inter_300Light', color: '#000000', fontSize: 15, lineHeight: 15 }}>
                Não recebeu o e-mail?{' '}
              </Text>
              <Text
                onPress={() => setEnviado(false)}
                style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 15,
                  lineHeight: 15,
                  color: AUTH_LINK_COLOR,
                }}>
                Reenviar
              </Text>
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={AUTH_BG_GRADIENT}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled">
          <View style={cardShell}>
            <View style={{ alignItems: 'center', marginBottom: 4 }}>
              <Image
                source={require('../assets/images/logo-lads.png')}
                style={{ width: 200, height: 72 }}
                resizeMode="contain"
              />
            </View>

            <View style={{ alignSelf: 'center', width: '100%', maxWidth: 222, marginTop: 12, marginBottom: 20 }}>
              <Text
                {...androidFont}
                style={{
                  textAlign: 'center',
                  fontFamily: 'Inter_300Light',
                  color: '#000000',
                  fontSize: 15,
                  lineHeight: 18,
                  letterSpacing: 0,
                }}>
                Digite seu e-mail para receber{'\n'}um link de redefinição de{'\n'}senha
              </Text>
            </View>

            <Text {...androidFont} style={authFieldLabelStyle}>
              E-mail
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ ...authTextInputStyle, marginBottom: 24 }}
            />

            <TouchableOpacity
              onPress={handleEnviar}
              disabled={loading}
              activeOpacity={0.75}
              style={{
                backgroundColor: '#2563EB',
                borderRadius: 10,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                {...androidFont}
                style={{
                  fontFamily: 'Inter_700Bold',
                  color: '#FFFFFF',
                  fontSize: 15,
                }}>
                {loading ? 'Enviando...' : 'Enviar link de redefinição'}
              </Text>
            </TouchableOpacity>

            <Pressable
              onPress={() => router.replace('/login')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                gap: 6,
              }}>
              <FontAwesome name="arrow-left" size={14} color="#000000" />
              <Text
                {...androidFont}
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 14,
                  lineHeight: 14,
                  letterSpacing: 0,
                  color: '#000000',
                }}>
                Voltar para o login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
