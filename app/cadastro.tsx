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

export default function CadastroScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  return (
    <LinearGradient
      colors={["#1D4ED8", "#7C3AED"]}
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
          <View className="rounded-2xl bg-white px-6 py-8 shadow-lg">
            {/* Logo */}
            <View className="items-center mb-1">
              <Image
                source={require("../assets/images/logo-lads.png")}
                style={{ width: 200, height: 72 }}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                textAlign: "center",
                color: "#6B7280",
                fontSize: 14,
                marginTop: 12,
                marginBottom: 20,
              }}
            >
              Crie sua conta para começar
            </Text>

            {/* Nome completo */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111827",
                marginBottom: 6,
              }}
            >
              Nome completo
            </Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: "#111827",
                backgroundColor: "#FAFAFA",
                marginBottom: 16,
              }}
            />

            {/* E-mail */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111827",
                marginBottom: 6,
              }}
            >
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
                borderColor: "#E5E7EB",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: "#111827",
                backgroundColor: "#FAFAFA",
                marginBottom: 16,
              }}
            />

            {/* Senha */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111827",
                marginBottom: 6,
              }}
            >
              Senha
            </Text>
            <TextInput
              value={senha}
              onChangeText={setSenha}
              placeholder="Crie uma senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: "#111827",
                backgroundColor: "#FAFAFA",
                marginBottom: 16,
              }}
            />

            {/* Confirmar senha */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111827",
                marginBottom: 6,
              }}
            >
              Confirmar senha
            </Text>
            <TextInput
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Confirme sua senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: "#111827",
                backgroundColor: "#FAFAFA",
                marginBottom: 24,
              }}
            />

            {/* Botão Cadastrar */}
            <Pressable
              onPress={() => router.replace("/login")}
              android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
              style={{ backgroundColor: "#4F46E5", borderRadius: 10, paddingVertical: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
                Cadastrar
              </Text>
            </Pressable>

            {/* Fazer login */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 13, color: "#6B7280" }}>
                Já tem uma conta?{" "}
              </Text>
              <Pressable onPress={() => router.replace("/login")}>
                <Text
                  style={{ fontSize: 13, color: "#4F46E5", fontWeight: "700" }}
                >
                  Fazer login
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
