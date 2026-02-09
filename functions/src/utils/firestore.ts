import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
} as const;

// Helper to convert Firestore timestamp to Date
export function timestampToDate(
  timestamp: admin.firestore.Timestamp | undefined
): Date {
  return timestamp?.toDate() ?? new Date();
}

// Helper to get server timestamp
export function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}
