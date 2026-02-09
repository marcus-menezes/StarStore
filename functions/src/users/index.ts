import * as functions from 'firebase-functions';
import { db, COLLECTIONS, serverTimestamp } from '../utils';

/**
 * Trigger when a new user is created in Firebase Auth
 * Creates a corresponding user document in Firestore
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  try {
    await db.collection(COLLECTIONS.USERS).doc(uid).set({
      email: email || '',
      displayName: displayName || null,
      photoURL: photoURL || null,
      createdAt: serverTimestamp(),
    });

    console.log(`User document created for ${uid}`);
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
});
