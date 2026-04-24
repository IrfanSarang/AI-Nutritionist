import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSession = async (
  userId: string,
  profileId: string,
  token: string
) => {
  await AsyncStorage.multiSet([
    ['authToken', token],
    ['userId', userId],
    ['profileId', profileId],
  ]);
};

export const getSession = async () => {
  const values = await AsyncStorage.multiGet(['authToken', 'userId', 'profileId']);
  return {
    token:     values[0][1],
    userId:    values[1][1],
    profileId: values[2][1],
  };
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove(['authToken', 'userId', 'profileId']);
};