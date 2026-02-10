import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { StyleSheet, View, Text, Pressable, Modal, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeOutDown } from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';

// ─── Toast types ───────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState extends ToastConfig {
  id: number;
}

// ─── Modal types ───────────────────────────────────────────
interface ModalButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface ModalConfig {
  title: string;
  message: string;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  iconColor?: string;
  buttons?: ModalButton[];
}

// ─── Context ───────────────────────────────────────────────
interface FeedbackContextValue {
  showToast: (config: ToastConfig) => void;
  showModal: (config: ModalConfig) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

// ─── Toast icon & color mapping ────────────────────────────
const TOAST_META: Record<
  ToastType,
  { icon: React.ComponentProps<typeof FontAwesome>['name']; bg: string; text: string }
> = {
  success: { icon: 'check-circle', bg: '#16a34a', text: '#FFFFFF' },
  error: { icon: 'times-circle', bg: '#dc2626', text: '#FFFFFF' },
  warning: { icon: 'exclamation-triangle', bg: '#ea580c', text: '#FFFFFF' },
  info: { icon: 'info-circle', bg: '#2563eb', text: '#FFFFFF' },
};

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Toast Component ───────────────────────────────────────
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

// ─── Modal Component ───────────────────────────────────────
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

// ─── Provider ──────────────────────────────────────────────
export function FeedbackProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const toastId = useRef(0);

  const showToast = useCallback((config: ToastConfig) => {
    const id = ++toastId.current;
    const duration = config.duration ?? 3000;
    setToasts((prev) => [...prev, { ...config, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showModal = useCallback((config: ModalConfig) => {
    setModal(config);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <FeedbackContext.Provider value={{ showToast, showModal }}>
      {children}

      {/* Toast layer */}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </View>

      {/* Modal layer */}
      {modal && <CustomModal config={modal} onClose={closeModal} />}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return ctx;
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Toast
  toastContainer: {
    position: 'absolute',
    top: 55,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH - Spacing.md * 2,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayPress: {
    ...StyleSheet.absoluteFillObject,
  },
  // Modal card
  modalCard: {
    width: SCREEN_WIDTH - Spacing.xl * 2,
    maxWidth: 360,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalMessage: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  buttonsColumn: {
    gap: Spacing.sm,
    width: '100%',
  },
  modalButton: {
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonFlex: {
    flex: 1,
  },
  modalButtonOutline: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
