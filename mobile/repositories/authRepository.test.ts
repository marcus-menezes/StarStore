import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  getIdToken,
  signInWithEmailAndPassword,
  updateProfile,
} from '@react-native-firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { AuthRepository } from './authRepository';

let repo: AuthRepository;

beforeEach(() => {
  jest.clearAllMocks();
  repo = new AuthRepository();
});

const mockFirebaseUser = {
  uid: 'user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.png',
  metadata: {
    creationTime: '2024-01-01T00:00:00.000Z',
  },
  reload: jest.fn(),
};

describe('AuthRepository', () => {
  describe('signIn', () => {
    it('calls Firebase signInWithEmailAndPassword', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockFirebaseUser,
      });

      await repo.signIn('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });
  });

  describe('signUp', () => {
    it('calls Firebase createUserWithEmailAndPassword', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockFirebaseUser,
      });

      await repo.signUp('test@example.com', 'password123');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });

    it('updates profile when displayName is provided', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockFirebaseUser,
      });

      await repo.signUp('test@example.com', 'password123', 'John Doe');

      expect(updateProfile).toHaveBeenCalledWith(mockFirebaseUser, {
        displayName: 'John Doe',
      });
    });

    it('does not update profile when no displayName provided', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockFirebaseUser,
      });

      await repo.signUp('test@example.com', 'password123');

      expect(updateProfile).not.toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('clears auth data and calls Firebase signOut', async () => {
      await repo.signOut();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_data');
      expect(firebaseSignOut).toHaveBeenCalled();
    });
  });

  describe('onAuthStateChanged', () => {
    it('registers a callback with Firebase', () => {
      const callback = jest.fn();
      repo.onAuthStateChanged(callback);

      expect(firebaseOnAuthStateChanged).toHaveBeenCalled();
    });

    it('returns an unsubscribe function', () => {
      const unsubscribe = jest.fn();
      (firebaseOnAuthStateChanged as jest.Mock).mockReturnValue(unsubscribe);

      const unsub = repo.onAuthStateChanged(jest.fn());
      expect(typeof unsub).toBe('function');
    });

    it('maps Firebase user to app User and persists auth data', async () => {
      let firebaseCallback: ((user: unknown) => void) | undefined;
      (firebaseOnAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
        firebaseCallback = cb;
        return jest.fn();
      });
      (getIdToken as jest.Mock).mockResolvedValue('mock-token');

      const callback = jest.fn();
      repo.onAuthStateChanged(callback);

      // Simulate Firebase auth state change
      await firebaseCallback!(mockFirebaseUser);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-123',
          email: 'test@example.com',
          displayName: 'Test User',
        })
      );

      // Should persist auth data
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'mock-token');
    });

    it('calls callback with null and clears data on sign out', async () => {
      let firebaseCallback: ((user: unknown) => void) | undefined;
      (firebaseOnAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
        firebaseCallback = cb;
        return jest.fn();
      });

      const callback = jest.fn();
      repo.onAuthStateChanged(callback);

      await firebaseCallback!(null);

      expect(callback).toHaveBeenCalledWith(null);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
    });
  });

  describe('onProfileUpdated', () => {
    it('subscribes and unsubscribes listeners', () => {
      const listener = jest.fn();
      const unsubscribe = repo.onProfileUpdated(listener);

      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
      // After unsubscribe, listener should not be called
    });
  });

  describe('clearAuthData', () => {
    it('removes auth token and user data from SecureStore', async () => {
      await repo.clearAuthData();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_data');
    });

    it('does not throw when SecureStore fails', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(repo.clearAuthData()).resolves.not.toThrow();
    });
  });
});
