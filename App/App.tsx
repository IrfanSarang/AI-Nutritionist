import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserIdContext';
import { ActiveProfileProvider } from './src/context/ActiveProfileContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
  const checkSession = async () => {
    try {
      // ✅ Check onboarding first
      const onboardingDone = await AsyncStorage.getItem('onboardingDone');
      if (onboardingDone !== 'true') {
        setInitialRoute('Onboarding');
        return;
      }

      // Then check auth as before
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (token && userId) {
        setInitialRoute('MainApp');
      } else {
        setInitialRoute('GetStarted');
      }
    } catch (err) {
      setInitialRoute('GetStarted');
    }
  };

  checkSession();
}, []);



  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <UserProvider>
        <ActiveProfileProvider>
          <NavigationContainer>
            <AppNavigator initialRoute={initialRoute} />
          </NavigationContainer>
        </ActiveProfileProvider>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;