// App/src/context/UserIdContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserContextType = {
  userId: string;
  setUserId: (id: string) => void;
  authToken: string;
  setAuthToken: (token: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserIdState] = useState('');
  const [authToken, setAuthTokenState] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      const savedId = await AsyncStorage.getItem('userId');
      const savedToken = await AsyncStorage.getItem('authToken');

      if (savedId) setUserIdState(savedId);
      if (savedToken) setAuthTokenState(savedToken);
    };

    loadSession();
  }, []);

  const setUserId = async (id: string) => {
    setUserIdState(id);
    await AsyncStorage.setItem('userId', id);
  };

  const setAuthToken = async (token: string) => {
    setAuthTokenState(token);
    await AsyncStorage.setItem('authToken', token);
  };

  return (
    <UserContext.Provider
      value={{ userId, setUserId, authToken, setAuthToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside UserProvider');
  return context;
};