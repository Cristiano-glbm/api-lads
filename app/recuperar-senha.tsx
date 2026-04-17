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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RecuperarSenhaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <LinearGradient
      colors={['#1D4ED8', '#7C3AED']}
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
          <View className="rounded-2xl bg-white px-6 py-8 shadow-lg">
            {/* Logo */}
            <View className="items-center mb-1">
              <Image
                source={require('../assets/images/logo-lads.png')}
                style={{ width: 200, height: 72 }}
                resizeMode="contain"
              />
            </View>

            <Text style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginTop: 12, marginBottom: 20, lineHeight: 22 }}>
              Digite seu e-mail para receber{'\n'}um link de redefinição de{'\n'}senha
            </Text>

            {/* E-mail */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6 }}>
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
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: '#111827',
                backgroundColor: '#FAFAFA',
                marginBottom: 24,
              }}
            />

            {/* Botão Enviar */}
            <Pressable
              android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
              style={{ backgroundColor: '#4F46E5', borderRadius: 10, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
                Enviar link de redefinição
              </Text>
            </Pressable>

            {/* Voltar para o login */}
            <Pressable
              onPress={() => router.replace('/login')}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 6 }}>
              <FontAwesome name="arrow-left" size={13} color="#4F46E5" />
              <Text style={{ fontSize: 13, color: '#4F46E5', fontWeight: '600' }}>
                Voltar para o login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
