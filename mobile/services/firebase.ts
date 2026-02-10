// Firebase configuration and helpers (modular API)
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { collection, doc, getFirestore } from '@react-native-firebase/firestore';

// Infer FirebaseUser type from the modular API (named type export not available)
type FirebaseUser = NonNullable<ReturnType<typeof getAuth>['currentUser']>;

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const auth = getAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const signUp = async (email: string, password: string) => {
  const auth = getAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const signOut = () => {
  const auth = getAuth();
  return firebaseSignOut(auth);
};

export const subscribeToAuthState = (callback: (user: FirebaseUser | null) => void) => {
  const auth = getAuth();
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
};

// Firestore helpers
export const db = getFirestore();

export const getCollection = (collectionPath: string) => {
  return collection(db, collectionPath);
};

export const getDocument = (collectionPath: string, docId: string) => {
  return doc(db, collectionPath, docId);
};

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
} as const;
