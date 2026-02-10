import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeOutDown } from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { styles } from './FeedbackContext.styles';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState extends ToastConfig {
  id: number;
}

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

interface FeedbackContextValue {
  showToast: (config: ToastConfig) => void;
  showModal: (config: ModalConfig) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

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

      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </View>

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
