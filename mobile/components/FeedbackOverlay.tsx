import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Modal, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ModalButton, ModalConfig, ToastState } from '@/store/feedbackStore';
import { useFeedbackStore } from '@/store/feedbackStore';
import { styles } from './FeedbackOverlay.styles';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const TOAST_META: Record<
  ToastType,
  { icon: React.ComponentProps<typeof FontAwesome>['name']; bg: string; text: string }
> = {
  success: { icon: 'check-circle', bg: '#16a34a', text: '#FFFFFF' },
  error: { icon: 'times-circle', bg: '#dc2626', text: '#FFFFFF' },
  warning: { icon: 'exclamation-triangle', bg: '#ea580c', text: '#FFFFFF' },
  info: { icon: 'info-circle', bg: '#2563eb', text: '#FFFFFF' },
};

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const meta = TOAST_META[toast.type ?? 'info'];

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={[styles.toast, { backgroundColor: meta.bg }]}
    >
      <FontAwesome name={meta.icon} size={20} color={meta.text} />
      <Text style={[styles.toastText, { color: meta.text }]} numberOfLines={3}>
        {toast.message}
      </Text>
      <Pressable onPress={onDismiss} hitSlop={10}>
        <FontAwesome name="times" size={16} color={`${meta.text}99`} />
      </Pressable>
    </Animated.View>
  );
}

function CustomModal({
  config,
  onClose,
}: {
  config: ModalConfig;
  onClose: () => void;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const buttons = config.buttons ?? [{ text: 'OK', style: 'default' }];

  const handlePress = (btn: ModalButton) => {
    onClose();
    btn.onPress?.();
  };

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={styles.overlay}
      >
        <Pressable style={styles.overlayPress} onPress={onClose} />
        <Animated.View
          entering={FadeInDown.springify().damping(18).stiffness(160)}
          exiting={FadeOutDown.duration(200)}
          style={[styles.modalCard, { backgroundColor: colors.surface }]}
        >
          {config.icon && (
            <View
              style={[
                styles.modalIconCircle,
                { backgroundColor: `${config.iconColor ?? colors.tint}18` },
              ]}
            >
              <FontAwesome name={config.icon} size={28} color={config.iconColor ?? colors.tint} />
            </View>
          )}
          <Text style={[styles.modalTitle, { color: colors.text }]}>{config.title}</Text>
          <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
            {config.message}
          </Text>

          <View style={buttons.length > 2 ? styles.buttonsColumn : styles.buttonsRow}>
            {buttons.map((btn) => {
              const isCancel = btn.style === 'cancel';
              const isDestructive = btn.style === 'destructive';
              return (
                <Pressable
                  key={btn.text}
                  style={[
                    styles.modalButton,
                    buttons.length <= 2 && styles.modalButtonFlex,
                    isCancel
                      ? [styles.modalButtonOutline, { borderColor: colors.border }]
                      : isDestructive
                        ? { backgroundColor: colors.error }
                        : { backgroundColor: colors.buttonBackground },
                  ]}
                  onPress={() => handlePress(btn)}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      isCancel
                        ? { color: colors.text }
                        : isDestructive
                          ? { color: '#FFFFFF' }
                          : { color: colors.buttonText },
                    ]}
                  >
                    {btn.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

/**
 * Renders toast and modal overlays driven by the feedback Zustand store.
 * Place this component once at the root of the app (inside RootLayoutNav).
 */
export function FeedbackOverlay() {
  const toasts = useFeedbackStore((state) => state.toasts);
  const modal = useFeedbackStore((state) => state.modal);
  const dismissToast = useFeedbackStore((state) => state.dismissToast);
  const closeModal = useFeedbackStore((state) => state.closeModal);

  return (
    <>
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </View>

      {modal && <CustomModal config={modal} onClose={closeModal} />}
    </>
  );
}
