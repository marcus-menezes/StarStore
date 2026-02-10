import { CrashReport } from '@/services/analytics';
import { STORAGE_KEYS, SecureStorage } from '@/services/storage';
import type { User } from '@/types';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  getAuth,
  getIdToken,
  signInWithEmailAndPassword,
  updateProfile,
} from '@react-native-firebase/auth';
// Infer FirebaseUser type from the modular API (named type export not available)
type FirebaseUser = Parameters<typeof getIdToken>[0];

// Repository interface (Dependency Inversion)
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName?: string): Promise<void>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
  updateDisplayName(displayName: string): Promise<void>;
  clearAuthData(): Promise<void>;
}

// Firebase implementation (modular API)
export class AuthRepository implements IAuthRepository {
  private profileListeners = new Set<(user: User) => void>();

  private get auth() {
    return getAuth();
  }

  /** Subscribe to profile data changes (e.g. displayName update) */
  onProfileUpdated(callback: (user: User) => void): () => void {
    this.profileListeners.add(callback);
    return () => {
      this.profileListeners.delete(callback);
    };
  }

  private notifyProfileUpdate(user: User) {
    for (const cb of this.profileListeners) cb(user);
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
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        'AuthRepository.persistAuthData'
      );
    }
  }

  async updateDisplayName(displayName: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    await updateProfile(currentUser, { displayName });
    // Firebase doesn't re-trigger onAuthStateChanged for profile updates,
    // so we need to reload and manually notify all listeners.
    await currentUser.reload();
    const refreshed = this.auth.currentUser;
    if (refreshed) {
      const mapped = this.mapFirebaseUser(refreshed);
      this.notifyProfileUpdate(mapped);
      await this.persistAuthData(refreshed);
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      await SecureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStorage.removeItem('user_data');
    } catch (error) {
      console.error('[AuthRepository] clearAuthData failed:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        'AuthRepository.clearAuthData'
      );
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
