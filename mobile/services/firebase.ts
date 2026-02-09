// Firebase configuration and helpers
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { user } = await auth().signInWithEmailAndPassword(email, password);
  return user;
};

export const signUp = async (email: string, password: string) => {
  const { user } = await auth().createUserWithEmailAndPassword(email, password);
  return user;
};

export const signOut = () => auth().signOut();

export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
) => {
  return auth().onAuthStateChanged(callback);
};

export const getCurrentUser = () => auth().currentUser;

// Firestore helpers
export const db = firestore();

export const getCollection = (collectionPath: string) => {
  return firestore().collection(collectionPath);
};

export const getDocument = (collectionPath: string, docId: string) => {
  return firestore().collection(collectionPath).doc(docId);
};

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
} as const;

export { auth, firestore };
