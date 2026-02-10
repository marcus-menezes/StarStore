import { CrashReport } from '@/services/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const SecureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        `SecureStorage.getItem(${key})`
      );
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        `SecureStorage.setItem(${key})`
      );
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        `SecureStorage.removeItem(${key})`
      );
    }
  },
};

export const Storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        `Storage.getItem(${key})`
      );
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        `Storage.setItem(${key})`
      );
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        `Storage.removeItem(${key})`
      );
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        'Storage.clear'
      );
    }
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  CART: 'cart',
} as const;
