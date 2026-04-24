import AsyncStorage from '@react-native-async-storage/async-storage';

export const authFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await AsyncStorage.getItem('authToken');
  return fetch(url, {
    ...options,
    headers: {
      
    },
  });
};