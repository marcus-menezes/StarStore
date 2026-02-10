/* eslint-disable @typescript-eslint/no-require-imports */

// ─── React Native Reanimated mock ──────────────────────────
require('react-native-reanimated').setUpTests();

// ─── Firebase Auth ─────────────────────────────────────────
jest.mock('@react-native-firebase/auth', () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  getIdToken: jest.fn(() => Promise.resolve('mock-token')),
}));

// ─── Firebase Firestore ────────────────────────────────────
jest.mock('@react-native-firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

// ─── Firebase Analytics ────────────────────────────────────
jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: jest.fn(() => ({})),
  logEvent: jest.fn(),
  logScreenView: jest.fn(),
  setUserId: jest.fn(),
  setUserProperty: jest.fn(),
}));

// ─── Firebase Crashlytics ──────────────────────────────────
jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(() => ({})),
  log: jest.fn(),
  recordError: jest.fn(),
  setUserId: jest.fn(),
  setAttributes: jest.fn(),
}));

// ─── Expo Secure Store ─────────────────────────────────────
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// ─── Async Storage ─────────────────────────────────────────
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

// ─── Expo Router ───────────────────────────────────────────
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useSegments: jest.fn(() => []),
  useRootNavigationState: jest.fn(),
  Link: 'Link',
  Redirect: 'Redirect',
}));

// ─── i18n ──────────────────────────────────────────────────
jest.mock('@/i18n', () => ({
  t: (key: string) => key,
}));

// ─── Analytics service ─────────────────────────────────────
jest.mock('@/services/analytics', () => ({
  Analytics: {
    setUserId: jest.fn(),
    logEvent: jest.fn(),
    logScreenView: jest.fn(),
    logLogin: jest.fn(),
    logSignUp: jest.fn(),
    logViewItem: jest.fn(),
    logAddToCart: jest.fn(),
    logRemoveFromCart: jest.fn(),
    logBeginCheckout: jest.fn(),
    logPurchase: jest.fn(),
    setUserProperty: jest.fn(),
  },
  CrashReport: {
    recordError: jest.fn(),
    setUserId: jest.fn(),
    log: jest.fn(),
    setAttributes: jest.fn(),
  },
}));

// ─── Expo Vector Icons ─────────────────────────────────────
jest.mock('@expo/vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('@expo/vector-icons', () => ({
  FontAwesome5: 'FontAwesome5',
}));

// ─── Expo Linear Gradient ──────────────────────────────────
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));
