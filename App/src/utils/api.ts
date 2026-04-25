import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Optional: global logout handler (you should wire this in your app)
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

const clearSession = async () => {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('user');
};

export const authFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = await AsyncStorage.getItem('authToken');

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // 🔴 HANDLE EXPIRED TOKEN / INVALID SESSION
  if (response.status === 401) {
    await clearSession();

    // notify app (navigate to login / reset state)
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      Alert.alert('Session Expired', 'Please log in again.');
    }
  }

  return response;
};
