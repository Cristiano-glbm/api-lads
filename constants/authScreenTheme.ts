import { Platform } from 'react-native';

/** Fundo — Inspect Figma (gradiente vertical) */
export const AUTH_BG_GRADIENT: [string, string] = ['#046CD4', '#9810FA'];

/** Botão primário — Fill + borda Inspect Figma */
/** Fill botão primário — Inspect Figma Cadastro (#4139F6) */
export const AUTH_BTN_FILL = '#4139F6';
export const AUTH_BTN_BORDER = 'rgba(0,0,0,0.2)';

/** Links (Esqueci senha, Cadastre-se, Fazer login, Reenviar) */
export const AUTH_LINK_COLOR = '#4139F6';

export const authAndroidFont = () =>
  Platform.OS === 'android' ? { includeFontPadding: false as const } : {};

export const authCardShadow =
  Platform.OS === 'web'
    ? {
        boxShadow:
          '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
      }
    : Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
        }
      : {};

/** Drop shadow botão: Y 4, Blur 4, #000 25% */
export const authButtonShadow =
  Platform.OS === 'web'
    ? { boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)' }
    : Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }
      : {};

/** Rótulos E-mail / Senha — Figma Inter 600, 14, #000 */
export const authFieldLabelStyle = {
  fontFamily: 'Inter_600SemiBold' as const,
  fontSize: 14,
  lineHeight: 14,
  letterSpacing: 0,
  color: '#000000',
  marginBottom: 6,
};

/** Campos de texto — branco, borda cinza, Inter 400 */
export const authTextInputStyle = {
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 14,
  fontFamily: 'Inter_400Regular' as const,
  color: '#111827',
  backgroundColor: '#FFFFFF',
};
