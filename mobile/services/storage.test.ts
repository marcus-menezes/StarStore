import { CrashReport } from '@/services/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS, SecureStorage, Storage } from './storage';

describe('SecureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('returns value from SecureStore', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('token-value');

      const result = await SecureStorage.getItem('auth_token');
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_token');
      expect(result).toBe('token-value');
    });

    it('returns null when key does not exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await SecureStorage.getItem('nonexistent');
      expect(result).toBeNull();
    });

    it('returns null and reports crash on error', async () => {
      const error = new Error('SecureStore unavailable');
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(error);

      const result = await SecureStorage.getItem('auth_token');
      expect(result).toBeNull();
      expect(CrashReport.recordError).toHaveBeenCalledWith(
        error,
        'SecureStorage.getItem(auth_token)'
      );
    });
  });

  describe('setItem', () => {
    it('stores value in SecureStore', async () => {
      await SecureStorage.setItem('auth_token', 'new-token');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'new-token');
    });

    it('reports crash on error', async () => {
      const error = new Error('Storage full');
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(error);

      await SecureStorage.setItem('auth_token', 'value');
      expect(CrashReport.recordError).toHaveBeenCalledWith(
        error,
        'SecureStorage.setItem(auth_token)'
      );
    });
  });

  describe('removeItem', () => {
    it('deletes value from SecureStore', async () => {
      await SecureStorage.removeItem('auth_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
    });

    it('reports crash on error', async () => {
      const error = new Error('Delete failed');
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(error);

      await SecureStorage.removeItem('auth_token');
      expect(CrashReport.recordError).toHaveBeenCalledWith(
        error,
        'SecureStorage.removeItem(auth_token)'
      );
    });
  });
});

describe('Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('returns parsed JSON from AsyncStorage', async () => {
      const data = { name: 'test', value: 42 };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(data));

      const result = await Storage.getItem('my-key');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('my-key');
      expect(result).toEqual(data);
    });

    it('returns null when key does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await Storage.getItem('nonexistent');
      expect(result).toBeNull();
    });

    it('returns null and reports crash on error', async () => {
      const error = new Error('AsyncStorage error');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

      const result = await Storage.getItem('my-key');
      expect(result).toBeNull();
      expect(CrashReport.recordError).toHaveBeenCalledWith(error, 'Storage.getItem(my-key)');
    });
  });

  describe('setItem', () => {
    it('stores stringified JSON in AsyncStorage', async () => {
      const data = { foo: 'bar' };
      await Storage.setItem('my-key', data);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('my-key', JSON.stringify(data));
    });

    it('reports crash on error', async () => {
      const error = new Error('Write error');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

      await Storage.setItem('my-key', 'value');
      expect(CrashReport.recordError).toHaveBeenCalledWith(error, 'Storage.setItem(my-key)');
    });
  });

  describe('removeItem', () => {
    it('removes key from AsyncStorage', async () => {
      await Storage.removeItem('my-key');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('my-key');
    });
  });

  describe('clear', () => {
    it('clears all AsyncStorage data', async () => {
      await Storage.clear();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('reports crash on error', async () => {
      const error = new Error('Clear failed');
      (AsyncStorage.clear as jest.Mock).mockRejectedValue(error);

      await Storage.clear();
      expect(CrashReport.recordError).toHaveBeenCalledWith(error, 'Storage.clear');
    });
  });
});

describe('STORAGE_KEYS', () => {
  it('has the expected keys', () => {
    expect(STORAGE_KEYS.AUTH_TOKEN).toBe('auth_token');
    expect(STORAGE_KEYS.REFRESH_TOKEN).toBe('refresh_token');
    expect(STORAGE_KEYS.USER_PREFERENCES).toBe('user_preferences');
    expect(STORAGE_KEYS.CART).toBe('cart');
  });
});
