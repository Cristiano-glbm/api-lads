import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
} from "@/constants/authScreenTheme";
import { useAuth } from "@/context/AuthContext";
import { LadsModal } from "@/components/lads/LadsModal";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const androidFont = authAndroidFont();

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), senha);
      router.replace('/home');
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={AUTH_BG_GRADIENT}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              paddingHorizontal: 24,
              paddingVertical: 32,
              width: "100%",
              maxWidth: 448,
              alignSelf: "center",
              ...authCardShadow,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 4 }}>
              <Image
                source={require("../assets/images/logo-lads.png")}
                style={{ width: 200, height: 72 }}
                resizeMode="contain"
              />
            </View>

            <Text
              {...androidFont}
              style={{
                textAlign: "center",
                fontFamily: "Inter_100Thin",
                color: "#000000",
                fontSize: 15,
                lineHeight: 15,
                letterSpacing: 0,
                marginTop: 16,
                marginBottom: 20,
              }}
            >
              Entre na sua conta
            </Text>

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
              style={{ ...authTextInputStyle, marginBottom: 16 }}
            />

            <Text {...androidFont} style={authFieldLabelStyle}>
              Senha
            </Text>
            <TextInput
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={{ ...authTextInputStyle }}
            />

            <TouchableOpacity
              onPress={() => router.push("/recuperar-senha")}
              style={{ alignSelf: "flex-end", marginTop: 10, marginBottom: 20 }}
            >
              <Text
                {...androidFont}
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  lineHeight: 14,
                  letterSpacing: 0,
                  color: AUTH_LINK_COLOR,
                }}
              >
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.75}
              style={{
                backgroundColor: '#4139F6',
                borderRadius: 10,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                {...androidFont}
                style={{
                  fontFamily: "Inter_700Bold",
                  color: "#FFFFFF",
                  fontSize: 15,
                  letterSpacing: 0.2,
                }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              <Text
                {...androidFont}
                style={{
                  fontFamily: "Inter_100Thin",
                  fontSize: 14,
                  lineHeight: 14,
                  letterSpacing: 0,
                  color: "#000000",
                }}
              >
                Não tem uma conta?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/cadastro")}>
                <Text
                  {...androidFont}
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 14,
                    lineHeight: 14,
                    letterSpacing: 0,
                    color: AUTH_LINK_COLOR,
                  }}
                >
                  Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LadsModal
        visible={!!erro}
        title="Erro ao entrar"
        message={erro ?? ''}
        buttons={[{ text: 'OK', style: 'default', onPress: () => setErro(null) }]}
        onRequestClose={() => setErro(null)}
      />
    </LinearGradient>
  );
}
