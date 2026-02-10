import type FontAwesome from '@expo/vector-icons/FontAwesome';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

export interface ToastState extends ToastConfig {
  id: number;
}

export interface ModalButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface ModalConfig {
  title: string;
  message: string;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  iconColor?: string;
  buttons?: ModalButton[];
}

interface FeedbackState {
  toasts: ToastState[];
  modal: ModalConfig | null;
  _toastId: number;
  showToast: (config: ToastConfig) => void;
  dismissToast: (id: number) => void;
  showModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

export const useFeedbackStore = create<FeedbackState>()((set, get) => ({
  toasts: [],
  modal: null,
  _toastId: 0,

  showToast: (config: ToastConfig) => {
    const id = get()._toastId + 1;
    const duration = config.duration ?? 3000;

    set((state) => ({
      _toastId: id,
      toasts: [...state.toasts, { ...config, id }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  dismissToast: (id: number) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  showModal: (config: ModalConfig) => {
    set({ modal: config });
  },

  closeModal: () => {
    set({ modal: null });
  },
}));
