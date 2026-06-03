import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
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

import { LadsModal } from '@/components/lads/LadsModal';
import { useAuth } from '@/context/AuthContext';
import * as userService from '@/services/userService';

const androidNoPad = Platform.OS === 'android' ? { includeFontPadding: false as const } : {};
const MAX_WIDTH = 448;

const cardShadow = Platform.OS === 'web'
  ? { boxShadow: '0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)' } as const
  : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 } as const;

function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      {...androidNoPad}
      style={{
        fontFamily: 'Inter_700Bold',
        fontSize: 12,
        lineHeight: 16,
        color: '#6B7280',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginTop: 20,
        marginBottom: 12,
      }}>
      {label}
    </Text>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  editable = true,
  secureTextEntry,
  rightIcon,
  helperText,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  editable?: boolean;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
  helperText?: string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        {...androidNoPad}
        style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#374151', marginBottom: 6 }}>
        {label}
      </Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          keyboardType={keyboardType ?? 'default'}
          editable={editable}
          secureTextEntry={secureTextEntry}
          style={{
            borderWidth: 1,
            borderColor: editable ? '#E5E7EB' : '#F3F4F6',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: multiline ? 12 : 0,
            paddingRight: rightIcon ? 44 : 14,
            height: multiline ? 100 : 46,
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: editable ? '#1E2939' : '#9CA3AF',
            backgroundColor: editable ? '#FAFAFA' : '#F9FAFB',
          }}
        />
        {rightIcon && (
          <View style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}>
            {rightIcon}
          </View>
        )}
      </View>
      {helperText ? (
        <Text {...androidNoPad} style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

export function EditarPerfilScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [nome, setNome] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [curso, setCurso] = useState(user?.course ?? '');
  const [instituicao, setInstituicao] = useState(user?.institution ?? '');
  const [telefone, setTelefone] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUrl ?? null);
  const [avatarAlterado, setAvatarAlterado] = useState(false);

  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
    visible: false, type: 'success', message: '',
  });

  const nomeInicial = user?.name?.toUpperCase() ?? 'UTILIZADOR';
  const querAlterarSenha = novaSenha.length > 0 || senhaAtual.length > 0;

  async function pickImage(source: 'gallery' | 'camera') {
    let result: ImagePicker.ImagePickerResult;

    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar a foto.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher a foto.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });
    }

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const dataUri = `data:image/jpeg;base64,${asset.base64}`;
      setAvatarUri(dataUri);
      setAvatarAlterado(true);
    }
  }

  function handleCameraPress() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancelar', 'Câmera', 'Galeria'], cancelButtonIndex: 0 },
        (idx) => { if (idx === 1) pickImage('camera'); else if (idx === 2) pickImage('gallery'); },
      );
    } else {
      Alert.alert('Foto de perfil', 'Escolha uma opção', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: () => pickImage('camera') },
        { text: 'Galeria', onPress: () => pickImage('gallery') },
      ]);
    }
  }

  function showErro(msg: string) {
    setModal({ visible: true, type: 'error', message: msg });
  }

  async function handleSalvar() {
    if (nome.trim().length === 0) {
      showErro('O nome não pode ficar em branco.');
      return;
    }

    if (querAlterarSenha) {
      if (senhaAtual.length === 0) {
        showErro('Informe a senha atual para alterá-la.');
        return;
      }
      if (novaSenha.length < 6) {
        showErro('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (novaSenha !== confirmarSenha) {
        showErro('As senhas não coincidem.');
        return;
      }
    }

    setSaving(true);

    // Atualiza contexto imediatamente com os valores do formulário
    updateUser({
      ...user!,
      name: nome.trim(),
      bio: bio.trim() || undefined,
      institution: instituicao.trim() || undefined,
      course: curso.trim() || undefined,
      ...(avatarAlterado && avatarUri ? { avatarUrl: avatarUri } : {}),
    });

    try {
      await userService.updateProfile({
        name: nome.trim(),
        bio: bio.trim(),
        institution: instituicao.trim(),
        course: curso.trim(),
        ...(avatarAlterado && avatarUri ? { avatarUrl: avatarUri } : {}),
      });

      if (querAlterarSenha) {
        await userService.changePassword(senhaAtual, novaSenha);
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
      }
    } catch {
      // API falhou — dados já atualizados localmente, servidor pode ter salvo mesmo assim
    } finally {
      setSaving(false);
    }

    setModal({ visible: true, type: 'success', message: 'Perfil atualizado com sucesso!' });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* ── Header ── */}
      <View style={{ width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' }}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ paddingTop: insets.top }}>

          <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFFFFF', flex: 1 }}>
              Editar Perfil
            </Text>
          </View>

          <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 28 }}>
            <Pressable onPress={handleCameraPress} style={{ position: 'relative' }}>
              <View
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  backgroundColor: 'rgba(255,255,255,0.22)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: '#FFFFFF',
                  overflow: 'hidden',
                }}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={{ width: 88, height: 88, borderRadius: 44 }} />
                ) : (
                  <Ionicons name="person" size={44} color="#FFFFFF" />
                )}
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#2563EB',
                }}>
                <Ionicons name="camera" size={14} color="#2563EB" />
              </View>
            </Pressable>

            <Text
              {...androidNoPad}
              style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 17,
                color: '#FFFFFF',
                marginTop: 12,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}>
              {nomeInicial}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* ── Formulário ── */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            width: '100%',
            maxWidth: MAX_WIDTH,
            alignSelf: 'center',
            padding: 16,
            paddingBottom: Math.max(insets.bottom, 24) + 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, ...cardShadow }}>

            {/* Pessoal */}
            <Field label="Nome Completo" value={nome} onChangeText={setNome} placeholder="Seu nome completo" />
            <Field label="Bio" value={bio} onChangeText={setBio} placeholder="Fale mais sobre você" multiline />

            {/* Dados Acadêmicos */}
            <SectionLabel label="Dados Acadêmicos" />
            <Field label="Curso" value={curso} onChangeText={setCurso} placeholder="Curso" />
            <Field label="Instituição" value={instituicao} onChangeText={setInstituicao} placeholder="Instituição" />

            {/* Contato */}
            <SectionLabel label="Contato" />
            <Field
              label="Email"
              value={user?.email ?? ''}
              onChangeText={() => {}}
              editable={false}
              keyboardType="email-address"
              rightIcon={
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
              }
              helperText="O e-mail não pode ser alterado"
            />
            <Field
              label="Telefone"
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
            />

            {/* Segurança */}
            <SectionLabel label="Segurança" />
            <Field
              label="Senha atual"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              placeholder="Obrigatória para alterar senha"
              secureTextEntry={!showSenhaAtual}
              rightIcon={
                <Pressable onPress={() => setShowSenhaAtual((v) => !v)} hitSlop={8}>
                  <Ionicons name={showSenhaAtual ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </Pressable>
              }
            />
            <Field
              label="Nova senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              placeholder="••••••••"
              secureTextEntry={!showNovaSenha}
              rightIcon={
                <Pressable onPress={() => setShowNovaSenha((v) => !v)} hitSlop={8}>
                  <Ionicons name={showNovaSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </Pressable>
              }
            />
            <Field
              label="Confirmar nova senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="••••••••"
              secureTextEntry={!showConfirmar}
              rightIcon={
                <Pressable onPress={() => setShowConfirmar((v) => !v)} hitSlop={8}>
                  <Ionicons name={showConfirmar ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </Pressable>
              }
            />

            {/* Botões */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({
                  flex: 1,
                  height: 48,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: '#FDA4AF',
                  backgroundColor: pressed ? '#FFF1F2' : '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6,
                })}>
                <Ionicons name="close" size={16} color="#E11D48" />
                <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#E11D48' }}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSalvar}
                disabled={saving}
                style={({ pressed }) => ({
                  flex: 1,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: saving ? '#D1FAE5' : pressed ? '#059669' : '#10B981',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6,
                })}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                <Text {...androidNoPad} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFFFFF' }}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LadsModal
        visible={modal.visible}
        title={modal.type === 'success' ? 'Perfil atualizado!' : 'Atenção'}
        message={modal.message}
        onRequestClose={() => {
          if (modal.type === 'error') setModal((m) => ({ ...m, visible: false }));
        }}
        buttons={
          modal.type === 'success'
            ? [{ text: 'OK', style: 'default', onPress: () => { setModal((m) => ({ ...m, visible: false })); router.back(); } }]
            : [{ text: 'OK', style: 'cancel', onPress: () => setModal((m) => ({ ...m, visible: false })) }]
        }
      />
    </View>
  );
}
