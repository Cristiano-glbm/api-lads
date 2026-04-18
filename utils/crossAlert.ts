import { Alert, Platform } from 'react-native';

export interface CrossAlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

/**
 * Alert cross-platform: usa Alert.alert no nativo e window.alert/confirm no web,
 * onde Alert.alert não tem suporte.
 */
export function crossAlert(
  title: string,
  message?: string,
  buttons?: CrossAlertButton[],
) {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  const msg = message ? `${title}\n\n${message}` : title;

  if (!buttons || buttons.length <= 1) {
    window.alert(msg);
    buttons?.[0]?.onPress?.();
    return;
  }

  const cancelBtn = buttons.find((b) => b.style === 'cancel');
  const actionBtn = buttons.find((b) => b.style !== 'cancel');

  const confirmed = window.confirm(msg);
  if (confirmed) {
    actionBtn?.onPress?.();
  } else {
    cancelBtn?.onPress?.();
  }
}
