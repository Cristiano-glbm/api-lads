import { Modal, Platform, Pressable, Text, View } from 'react-native';

export interface LadsModalButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface LadsModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: LadsModalButton[];
  onRequestClose?: () => void;
}

const androidNoPad = Platform.OS === 'android' ? { includeFontPadding: false as const } : {};

function buttonColors(btnStyle?: LadsModalButton['style']) {
  if (btnStyle === 'destructive') return { bg: '#EF4444', text: '#FFFFFF', border: 'transparent' };
  if (btnStyle === 'cancel') return { bg: '#FFFFFF', text: '#374151', border: '#D1D5DB' };
  return { bg: '#432DD7', text: '#FFFFFF', border: 'transparent' };
}

export function LadsModal({ visible, title, message, buttons, onRequestClose }: LadsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}>
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
              ? ({ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' } as object)
              : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 10 }),
          }}>
          <Text
            {...androidNoPad}
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: 16,
              lineHeight: 24,
              color: '#1E2939',
              textAlign: 'center',
              marginBottom: message ? 8 : 24,
            }}>
            {title}
          </Text>

          {message ? (
            <Text
              {...androidNoPad}
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                lineHeight: 21,
                color: '#4B5563',
                textAlign: 'center',
                marginBottom: 24,
              }}>
              {message}
            </Text>
          ) : null}

          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            {buttons.map((btn) => {
              const colors = buttonColors(btn.style);
              return (
                <Pressable
                  key={btn.text}
                  onPress={btn.onPress}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: colors.bg,
                    borderRadius: 999,
                    borderWidth: colors.border !== 'transparent' ? 1 : 0,
                    borderColor: colors.border,
                    paddingVertical: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.85 : 1,
                  })}>
                  <Text
                    {...androidNoPad}
                    style={{
                      fontFamily: 'Inter_700Bold',
                      fontSize: 14,
                      color: colors.text,
                    }}>
                    {btn.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
