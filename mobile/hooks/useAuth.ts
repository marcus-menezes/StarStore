import { useState, useEffect, useCallback } from 'react';
import type { User, AuthState } from '@/types';
import { authRepository } from '@/repositories';
import { Analytics, CrashReport } from '@/services/analytics';

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
} {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = authRepository.onAuthStateChanged((mappedUser) => {
      setUser(mappedUser);
      setIsLoading(false);

      // Keep Analytics & Crashlytics in sync with the current user
      if (mappedUser) {
        Analytics.setUserId(mappedUser.id);
        CrashReport.setUserId(mappedUser.id);
      } else {
        Analytics.setUserId(null);
      }
    });

    // Listen for profile updates (displayName, photoURL, etc.)
    const unsubProfile = authRepository.onProfileUpdated((updatedUser) => {
      setUser(updatedUser);
    });

    return () => {
      unsubAuth();
      unsubProfile();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authRepository.signIn(email, password);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      await authRepository.signUp(email, password, displayName);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authRepository.signOut();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
}
