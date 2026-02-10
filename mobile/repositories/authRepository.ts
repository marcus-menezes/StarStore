import {
  getAuth,
  getIdToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  updateProfile,
} from '@react-native-firebase/auth';
import type { User as FirebaseUser } from '@react-native-firebase/auth';
import type { User } from '@/types';
import { SecureStorage, STORAGE_KEYS } from '@/services/storage';

// Repository interface (Dependency Inversion)
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName?: string): Promise<void>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
  clearAuthData(): Promise<void>;
}

// Firebase implementation (modular API)
export class AuthRepository implements IAuthRepository {
  private get auth() {
    return getAuth();
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUp(email: string, password: string, displayName?: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
  }

  async signOut(): Promise<void> {
    await this.clearAuthData();
    await firebaseSignOut(this.auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = this.mapFirebaseUser(firebaseUser);
        callback(user);
        await this.persistAuthData(firebaseUser);
      } else {
        callback(null);
        await this.clearAuthData();
      }
    });
  }

  private async persistAuthData(firebaseUser: FirebaseUser): Promise<void> {
    try {
      const token = await getIdToken(firebaseUser);
      await SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

      const userData = JSON.stringify(this.mapFirebaseUser(firebaseUser));
      await SecureStorage.setItem('user_data', userData);
    } catch (error) {
      console.error('[AuthRepository] persistAuthData failed:', error);
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      await SecureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStorage.removeItem('user_data');
    } catch (error) {
      console.error('[AuthRepository] clearAuthData failed:', error);
    }
  }

  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      createdAt: firebaseUser.metadata.creationTime
        ? new Date(firebaseUser.metadata.creationTime)
        : new Date(),
    };
  }
}

// Singleton instance
export const authRepository = new AuthRepository();
