import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import BASE_URL from '../config/url';

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
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeProfileName, setActiveProfileName] = useState<string | null>(
    null,
  );

  // Whenever profileId changes, fetch name from backend
  useEffect(() => {
    const fetchProfileName = async () => {
      if (!activeProfileId) {
        setActiveProfileName(null);
        return;
      }

      try {
        // Assuming backend endpoint returns profile details by ID
        const res = await fetch(
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
      value={{ activeProfileId, activeProfileName, setActiveProfileId }}
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

//========================================================================
// import React, { createContext, ReactNode, useContext, useState } from 'react';

// type ActiveProfileContextType = {
//   activeProfileId: string | null;
//   setActiveProfileId: (id: string | null) => void;
// };

// const ActiveProfileContext = createContext<
//   ActiveProfileContextType | undefined
// >(undefined);

// export const ActiveProfileProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

//   return (
//     <ActiveProfileContext.Provider
//       value={{ activeProfileId, setActiveProfileId }}
//     >
//       {children}
//     </ActiveProfileContext.Provider>
//   );
// };

// export const useActiveProfile = () => {
//   const context = useContext(ActiveProfileContext);
//   if (!context) {
//     throw new Error(
//       'useActiveProfile must be used within an ActiveProfileProvider',
//     );
//   }
//   return context;
// };
