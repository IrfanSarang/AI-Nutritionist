// App/src/context/ActiveProfileContext.tsx

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/url';
import { authFetch } from '../utils/api';

type ActiveProfileContextType = {
  activeProfileId: string | null;
  activeProfileName: string | null;
  setActiveProfileId: (id: string | null) => void;
};

const ActiveProfileContext = createContext<
  ActiveProfileContextType | undefined
>(undefined);

export const ActiveProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeProfileId, setActiveProfileIdState] = useState<
    string | null
  >(null);

  const [activeProfileName, setActiveProfileName] = useState<
    string | null
  >(null);

  // Load saved profile on mount
  useEffect(() => {
    const loadSavedProfile = async () => {
      const saved = await AsyncStorage.getItem('profileId');
      if (saved) setActiveProfileIdState(saved);
    };

    loadSavedProfile();
  }, []);

  // Persist profileId + update state
  const setActiveProfileId = async (id: string | null) => {
    setActiveProfileIdState(id);

    if (id) {
      await AsyncStorage.setItem('profileId', id);
    } else {
      await AsyncStorage.removeItem('profileId');
    }
  };

  // Fetch profile name when ID changes
  useEffect(() => {
    const fetchProfileName = async () => {
      if (!activeProfileId) {
        setActiveProfileName(null);
        return;
      }

      try {
        const res = await authFetch(
          `${BASE_URL}/api/users/${activeProfileId}/fetchName`,
        );

        const data = await res.json();

        if (res.ok && data.name) {
          setActiveProfileName(data.name);
        } else {
          setActiveProfileName('Guest');
        }
      } catch (err) {
        console.error('Failed to fetch profile name:', err);
        setActiveProfileName(null);
      }
    };

    fetchProfileName();
  }, [activeProfileId]);

  return (
    <ActiveProfileContext.Provider
      value={{
        activeProfileId,
        activeProfileName,
        setActiveProfileId,
      }}
    >
      {children}
    </ActiveProfileContext.Provider>
  );
};

export const useActiveProfile = () => {
  const context = useContext(ActiveProfileContext);
  if (!context) {
    throw new Error(
      'useActiveProfile must be used within an ActiveProfileProvider',
    );
  }
  return context;
};