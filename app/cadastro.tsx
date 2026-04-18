import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
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

export default function CadastroScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const androidFont = authAndroidFont();

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
                fontFamily: "Inter_200ExtraLight",
                color: "#000000",
                fontSize: 15,
                lineHeight: 15,
                letterSpacing: 0,
                marginTop: 12,
                marginBottom: 20,
              }}
            >
              Crie sua conta para começar
            </Text>

            <Text {...androidFont} style={authFieldLabelStyle}>
              Nome completo
            </Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              style={{ ...authTextInputStyle, marginBottom: 16 }}
            />

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
              placeholder="Crie uma senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={{ ...authTextInputStyle, marginBottom: 16 }}
            />

            <Text {...androidFont} style={authFieldLabelStyle}>
              Confirmar senha
            </Text>
            <TextInput
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Confirme sua senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={{ ...authTextInputStyle, marginBottom: 24 }}
            />

            <Pressable
              onPress={() => router.replace("/login")}
              android_ripple={{ color: "rgba(255,255,255,0.25)" }}
              style={({ pressed }) => ({
                backgroundColor: AUTH_BTN_FILL,
                borderWidth: 1,
                borderColor: AUTH_BTN_BORDER,
                borderRadius: 10,
                minHeight: 38,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.92 : 1,
                ...authButtonShadow,
              })}
            >
              <Text
                {...androidFont}
                style={{
                  fontFamily: "Inter_700Bold",
                  color: "#FFFFFF",
                  fontSize: 14,
                  lineHeight: 14,
                  letterSpacing: 0,
                }}
              >
                Cadastrar
              </Text>
            </Pressable>

            <Text
              {...androidFont}
              style={{
                marginTop: 20,
                textAlign: "center",
                alignSelf: "center",
                maxWidth: 222,
                fontSize: 14,
                lineHeight: 14,
                letterSpacing: 0,
              }}
            >
              <Text
                {...androidFont}
                style={{
                  fontFamily: "Inter_100Thin",
                  color: "#6B7280",
                  fontSize: 14,
                  lineHeight: 14,
                }}
              >
                Já tem uma conta?{" "}
              </Text>
              <Text
                {...androidFont}
                onPress={() => router.replace("/login")}
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 14,
                  lineHeight: 14,
                  color: AUTH_LINK_COLOR,
                }}
              >
                Fazer login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
