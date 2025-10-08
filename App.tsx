import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './backend/context/UserIdContext';
import { ActiveProfileProvider } from './backend/context/ActiveProfileContext';

const App = () => {
  return (
    <UserProvider>
      <ActiveProfileProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ActiveProfileProvider>
    </UserProvider>
  );
};

export default App;
