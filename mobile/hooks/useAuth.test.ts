import { authRepository } from '@/repositories';
import type { User } from '@/types';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from './useAuth';

// Mock the repositories module
jest.mock('@/repositories', () => ({
  authRepository: {
    onAuthStateChanged: jest.fn(() => jest.fn()),
    onProfileUpdated: jest.fn(() => jest.fn()),
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts with isLoading true and no user', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('subscribes to auth state changes on mount', () => {
    renderHook(() => useAuth());

    expect(authRepository.onAuthStateChanged).toHaveBeenCalled();
    expect(authRepository.onProfileUpdated).toHaveBeenCalled();
  });

  it('unsubscribes on unmount', () => {
    const unsubAuth = jest.fn();
    const unsubProfile = jest.fn();
    (authRepository.onAuthStateChanged as jest.Mock).mockReturnValue(unsubAuth);
    (authRepository.onProfileUpdated as jest.Mock).mockReturnValue(unsubProfile);

    const { unmount } = renderHook(() => useAuth());
    unmount();

    expect(unsubAuth).toHaveBeenCalled();
    expect(unsubProfile).toHaveBeenCalled();
  });

  it('updates user when onAuthStateChanged fires', async () => {
    let authCallback: ((user: User | null) => void) | undefined;
    (authRepository.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      authCallback = cb;
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    act(() => {
      authCallback!({
        id: 'user-1',
        email: 'test@example.com',
        displayName: 'Test',
        photoURL: null,
        createdAt: new Date(),
      });
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
      expect(result.current.user!.email).toBe('test@example.com');
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('signIn delegates to authRepository and manages loading', async () => {
    (authRepository.signIn as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });

    expect(authRepository.signIn).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('signUp delegates to authRepository', async () => {
    (authRepository.signUp as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUp('test@example.com', 'password', 'John');
    });

    expect(authRepository.signUp).toHaveBeenCalledWith('test@example.com', 'password', 'John');
  });

  it('signOut delegates to authRepository', async () => {
    (authRepository.signOut as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(authRepository.signOut).toHaveBeenCalled();
  });

  it('sets isLoading to false even if signIn throws', async () => {
    (authRepository.signIn as jest.Mock).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.signIn('test@example.com', 'bad');
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
